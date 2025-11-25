/**
 * @schema functional
 * Business entity schema for product catalog management
 */
CREATE SCHEMA [functional];
GO

/**
 * @table category Product categories for catalog organization
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [functional].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table product Products in the catalog
 * @multitenancy true
 * @softDelete true
 * @alias prd
 */
CREATE TABLE [functional].[product] (
  [idProduct] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idCategory] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [price] NUMERIC(18, 6) NOT NULL,
  [imageUrl] NVARCHAR(500) NOT NULL,
  [imageFallbackUrl] NVARCHAR(500) NOT NULL DEFAULT ('/assets/images/sem-imagem.jpg'),
  [imagePlaceholderSvg] NVARCHAR(MAX) NULL,
  [dimensions] NVARCHAR(50) NOT NULL,
  [material] NVARCHAR(100) NOT NULL,
  [available] BIT NOT NULL DEFAULT (1),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @primaryKey pkProduct
 * @keyType Object
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [pkProduct] PRIMARY KEY CLUSTERED ([idProduct]);
GO

/**
 * @foreignKey fkProduct_Category Relationship between product and category
 * @target functional.category
 */
ALTER TABLE [functional].[product]
ADD CONSTRAINT [fkProduct_Category] FOREIGN KEY ([idCategory])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @index ixCategory_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account]
ON [functional].[category]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixCategory_Account_Name
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixCategory_Account_Name]
ON [functional].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index uqCategory_Account_Name
 * @type Search
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_Name]
ON [functional].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account]
ON [functional].[product]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Category
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Category]
ON [functional].[product]([idAccount], [idCategory])
INCLUDE ([name], [price], [available])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Name
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Name]
ON [functional].[product]([idAccount], [name])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Account_Available
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account_Available]
ON [functional].[product]([idAccount], [available])
WHERE [deleted] = 0;
GO