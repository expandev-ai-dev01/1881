/**
 * @summary
 * Lists products with pagination, filtering, and sorting options
 *
 * @procedure spProductList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/product
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idCategory
 *   - Required: No
 *   - Description: Filter by category (NULL for all categories)
 *
 * @param {NVARCHAR} sortBy
 *   - Required: Yes
 *   - Description: Sort criteria (nome_asc, nome_desc, preco_asc, preco_desc, data_cadastro_desc)
 *
 * @param {INT} page
 *   - Required: Yes
 *   - Description: Page number (1-based)
 *
 * @param {INT} pageSize
 *   - Required: Yes
 *   - Description: Products per page (12, 24, or 36)
 *
 * @output {ProductList, n, n}
 * @column {INT} idProduct - Product identifier
 * @column {NVARCHAR} name - Product name
 * @column {NUMERIC} price - Product price
 * @column {NVARCHAR} imageUrl - Main image URL
 * @column {NVARCHAR} imageFallbackUrl - Fallback image URL
 * @column {NVARCHAR} imagePlaceholderSvg - SVG placeholder for loading
 * @column {NVARCHAR} dimensions - Product dimensions
 * @column {NVARCHAR} material - Main material
 * @column {BIT} available - Availability status
 * @column {NVARCHAR} categoryName - Category name
 * @column {INT} totalCount - Total products matching filter
 */
CREATE OR ALTER PROCEDURE [functional].[spProductList]
  @idAccount INTEGER,
  @idCategory INTEGER = NULL,
  @sortBy NVARCHAR(50) = 'nome_asc',
  @page INTEGER = 1,
  @pageSize INTEGER = 12
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Verify required parameters
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @page IS NULL OR @page < 1
  BEGIN
    ;THROW 51000, 'pageInvalid', 1;
  END;

  IF @pageSize IS NULL OR @pageSize NOT IN (12, 24, 36)
  BEGIN
    ;THROW 51000, 'pageSizeInvalid', 1;
  END;

  /**
   * @validation Verify sort criteria
   * @throw {sortByInvalid}
   */
  IF @sortBy NOT IN ('nome_asc', 'nome_desc', 'preco_asc', 'preco_desc', 'data_cadastro_desc')
  BEGIN
    ;THROW 51000, 'sortByInvalid', 1;
  END;

  /**
   * @validation Verify category exists if provided
   * @throw {categoryDoesntExist}
   */
  IF @idCategory IS NOT NULL AND NOT EXISTS (
    SELECT * FROM [functional].[category] [cat]
    WHERE [cat].[idCategory] = @idCategory
      AND [cat].[idAccount] = @idAccount
      AND [cat].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'categoryDoesntExist', 1;
  END;

  DECLARE @offset INTEGER = (@page - 1) * @pageSize;

  /**
   * @rule {be-pagination-pattern}
   * Calculate pagination offset
   */
  WITH [ProductData] AS (
    SELECT
      [prd].[idProduct],
      [prd].[name],
      [prd].[price],
      [prd].[imageUrl],
      [prd].[imageFallbackUrl],
      [prd].[imagePlaceholderSvg],
      [prd].[dimensions],
      [prd].[material],
      [prd].[available],
      [cat].[name] AS [categoryName],
      [prd].[dateCreated],
      COUNT(*) OVER() AS [totalCount]
    FROM [functional].[product] [prd]
      JOIN [functional].[category] [cat] ON ([cat].[idAccount] = [prd].[idAccount] AND [cat].[idCategory] = [prd].[idCategory])
    WHERE [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
      AND ([cat].[deleted] = 0)
      AND ((@idCategory IS NULL) OR ([prd].[idCategory] = @idCategory))
  )
  /**
   * @output {ProductList, n, n}
   */
  SELECT
    [idProduct],
    [name],
    [price],
    [imageUrl],
    [imageFallbackUrl],
    [imagePlaceholderSvg],
    [dimensions],
    [material],
    [available],
    [categoryName],
    [totalCount]
  FROM [ProductData]
  ORDER BY
    CASE WHEN @sortBy = 'nome_asc' THEN [name] END ASC,
    CASE WHEN @sortBy = 'nome_desc' THEN [name] END DESC,
    CASE WHEN @sortBy = 'preco_asc' THEN [price] END ASC,
    CASE WHEN @sortBy = 'preco_desc' THEN [price] END DESC,
    CASE WHEN @sortBy = 'data_cadastro_desc' THEN [dateCreated] END DESC
  OFFSET @offset ROWS
  FETCH NEXT @pageSize ROWS ONLY;
END;
GO