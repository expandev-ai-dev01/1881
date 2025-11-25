/**
 * @summary
 * Lists all active categories for an account
 *
 * @procedure spCategoryList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/category
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier
 *
 * @output {CategoryList, n, n}
 * @column {INT} idCategory - Category identifier
 * @column {NVARCHAR} name - Category name
 * @column {NVARCHAR} description - Category description
 * @column {INT} productCount - Number of products in category
 */
CREATE OR ALTER PROCEDURE [functional].[spCategoryList]
  @idAccount INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Verify required parameter
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @output {CategoryList, n, n}
   * @column {INT} idCategory
   * @column {NVARCHAR} name
   * @column {NVARCHAR} description
   * @column {INT} productCount
   */
  SELECT
    [cat].[idCategory],
    [cat].[name],
    [cat].[description],
    COUNT([prd].[idProduct]) AS [productCount]
  FROM [functional].[category] [cat]
    LEFT JOIN [functional].[product] [prd] ON ([prd].[idAccount] = [cat].[idAccount] AND [prd].[idCategory] = [cat].[idCategory] AND [prd].[deleted] = 0)
  WHERE [cat].[idAccount] = @idAccount
    AND [cat].[deleted] = 0
  GROUP BY
    [cat].[idCategory],
    [cat].[name],
    [cat].[description]
  ORDER BY
    [cat].[name];
END;
GO