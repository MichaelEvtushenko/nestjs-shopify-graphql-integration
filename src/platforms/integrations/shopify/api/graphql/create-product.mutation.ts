const MUTATION_CREATE_PRODUCT = `
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        tags
        productType
        vendor
        status
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;
export default MUTATION_CREATE_PRODUCT;
