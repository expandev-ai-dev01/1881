/**
 * @summary
 * Retrieves detailed information for a specific product
 *
 * @procedure spProductGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/product/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @param {INT} idProduct
 *   - Required: Yes
 *   - Description: Product identifier
 *
 * @output {ProductDetail, 1, n}
 * @column {INT} idProduct - Product identifier
 * @column {INT} idCategory - Category identifier
 * @column {NVARCHAR} name - Product name
 * @column {NUMERIC} price - Product price
 * @column {NVARCHAR} imageUrl - Main image URL
 * @column {NVARCHAR} imageFallbackUrl - Fallback image URL
 * @column {NVARCHAR} imagePlaceholderSvg - SVG placeholder
 * @column {NVARCHAR} dimensions - Product dimensions
 * @column {NVARCHAR} material - Main material
 * @column {BIT} available - Availability status
 * @column {NVARCHAR} categoryName - Category name
 * @column {DATETIME2} dateCreated - Creation date
 * @column {DATETIME2} dateModified - Last modification date
 */
CREATE OR ALTER PROCEDURE [functional].[spProductGet]
  @idAccount INTEGER,
  @idProduct INTEGER
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

  IF @idProduct IS NULL
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  /**
   * @validation Verify product exists
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT * FROM [functional].[product] [prd]
    WHERE [prd].[idProduct] = @idProduct
      AND [prd].[idAccount] = @idAccount
      AND [prd].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @output {ProductDetail, 1, n}
   */
  SELECT
    [prd].[idProduct],
    [prd].[idCategory],
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
    [prd].[dateModified]
  FROM [functional].[product] [prd]
    JOIN [functional].[category] [cat] ON ([cat].[idAccount] = [prd].[idAccount] AND [cat].[idCategory] = [prd].[idCategory])
  WHERE [prd].[idProduct] = @idProduct
    AND [prd].[idAccount] = @idAccount
    AND [prd].[deleted] = 0;
END;
GO