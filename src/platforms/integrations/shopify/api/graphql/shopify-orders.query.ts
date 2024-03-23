/**
 * note: pagination can also be implemented
 */
const QUERY_SHOPIFY_GET_ORDERS = `
    query getOrders {
      orders(first: 249) {
        edges {
          node {
            id
            name
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
              presentmentMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 250) {
              edges {
                cursor
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    sku
                    product {
                      id
                    }
                    weight
                    weightUnit
                    presentmentPrices(first: 1) {
                      edges {
                        node {
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                  taxLines {
                    priceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }   
      }
    }
  `;
export default QUERY_SHOPIFY_GET_ORDERS;