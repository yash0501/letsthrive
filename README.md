# Letsthrive Technical Assignment

This repository contains most of the code of the backend api created as well as its integration with the frontend on localhost.

I created a PostgreSQL database for keeping all the fee related data in it and that db is used to query the data for the specific api end point.

# API Documentation: Profitability Calculator

## Endpoint
**POST** `/api/v1/profitability-calculator`

## Description
This API calculates profitability for a given transaction based on parameters such as product category, selling price, weight, shipping mode, service level, product size, and location. It returns a detailed fee breakdown and the net earnings after deducting all applicable fees.

---

## Request

### Headers
- **`Content-Type`**: `application/json`

### Body Parameters

| **Field**          | **Type**   | **Required** | **Description**                                                                                       | **Example**                            |
|---------------------|------------|--------------|-------------------------------------------------------------------------------------------------------|----------------------------------------|
| `productCategory`   | `string`   | Yes          | The category and subcategory of the product, separated by `-`.                                        | `"Automotive - Helmets & Riding Gloves"` |
| `sellingPrice`      | `number`   | Yes          | The listing price of the product, including GST.                                                      | `876`                                  |
| `weight`            | `number`   | Yes          | The weight of the product in kilograms.                                                               | `0.5`                                  |
| `shippingMode`      | `string`   | Yes          | Shipping mode: `Easy Ship`, `FBA`, or `Self Ship`.                                                    | `"Easy Ship"`                          |
| `serviceLevel`      | `string`   | Yes          | Service level: `Premium`, `Advanced`, `Standard`, or `Basic`.                                         | `"Standard"`                           |
| `productSize`       | `string`   | Yes          | Product size: `Standard` or `Heavy & Bulky`.                                                          | `"Standard"`                           |
| `location`          | `string`   | Yes          | Shipping location: `Local`, `Regional`, `National`, or `IXD`.                                         | `"Local"`                              |

---

## Response

### Success (200 OK)

Returns a JSON object containing the fee breakdown and net earnings.

#### Example Response
```json
{
  "referralFee": 74.46,
  "closingFee": 30,
  "weightHandlingFee": 49.0,
  "pickAndPackFee": 14.0,
  "totalFees": 167.46,
  "netEarnings": 708.54
}
```

# Schema of tables created

```sql
Table "public.ReferralFee"
     Column      |     Type     | Collation | Nullable |                  Default                  
-----------------+--------------+-----------+----------+-------------------------------------------
 id              | integer      |           | not null | nextval('"ReferralFee_id_seq"'::regclass)
 productCategory | text         |           | not null | 
 subCategory     | text         |           |          | 
 priceRange      | numrange     |           | not null | 
 percentage      | numeric(5,2) |           | not null | 
Indexes:
    "ReferralFee_pkey" PRIMARY KEY, btree (id)

Table "public.ClosingFee"
    Column    |     Type      | Collation | Nullable |                 Default                  
--------------+---------------+-----------+----------+------------------------------------------
 id           | integer       |           | not null | nextval('"ClosingFee_id_seq"'::regclass)
 shippingMode | text          |           | not null | 
 priceRange   | numrange      |           | not null | 
 fee          | numeric(10,2) |           | not null | 
Indexes:
    "ClosingFee_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "ClosingFee_shippingMode_check" CHECK ("shippingMode" = ANY (ARRAY['Easy Ship'::text, 'FBA'::text, 'Self Ship'::text, 'Seller Flex'::text]))

Table "public.ShippingFee"
    Column    |     Type      | Collation | Nullable |                  Default                  
--------------+---------------+-----------+----------+-------------------------------------------
 id           | integer       |           | not null | nextval('"ShippingFee_id_seq"'::regclass)
 shippingMode | text          |           | not null | 
 serviceLevel | text          |           | not null | 
 productSize  | text          |           | not null | 
 location     | text          |           | not null | 
 weightMin    | numeric(10,2) |           | not null | 
 weightMax    | numeric(10,2) |           |          | 
 pricingType  | text          |           | not null | 
 price        | numeric(10,2) |           | not null | 
Indexes:
    "ShippingFee_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "ShippingFee_location_check" CHECK (location = ANY (ARRAY['Local'::text, 'Regional'::text, 'National'::text, 'IXD'::text]))
    "ShippingFee_pricingType_check" CHECK ("pricingType" = ANY (ARRAY['range'::text, 'additional'::text]))
    "ShippingFee_productSize_check" CHECK ("productSize" = ANY (ARRAY['Standard'::text, 'Heavy & Bulky'::text]))
    "ShippingFee_serviceLevel_check" CHECK ("serviceLevel" = ANY (ARRAY['Premium'::text, 'Advanced'::text, 'Standard'::text, 'Basic'::text]))
    "ShippingFee_shippingMode_check" CHECK ("shippingMode" = ANY (ARRAY['Easy Ship'::text, 'FBA'::text, 'Self Ship'::text]))

Table "public.OtherFee"
     Column     |     Type      | Collation | Nullable |                Default                 
----------------+---------------+-----------+----------+----------------------------------------
 id             | integer       |           | not null | nextval('"OtherFee_id_seq"'::regclass)
 feeType        | text          |           | not null | 
 applicableMode | text          |           |          | 
 productSize    | text          |           | not null | 
 subType        | text          |           |          | 
 unit           | text          |           | not null | 
 price          | numeric(10,2) |           | not null | 
Indexes:
    "OtherFee_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "OtherFee_productSize_check" CHECK ("productSize" = ANY (ARRAY['Standard'::text, 'Heavy & Bulky'::text]))
    "OtherFee_unit_check" CHECK (unit = ANY (ARRAY['flat'::text, 'per_cubic_foot'::text, 'per_item'::text]))
```