const QUERY_SHOPIFY_GET_ORDER_BY_ID = `
    query getOrderDetails($id: ID!) {
      order(id: $id) {
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
  `;
export default QUERY_SHOPIFY_GET_ORDER_BY_ID;