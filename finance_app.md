### Specifications
Chatgpt API:
    Take a picture or screenshot of your bills
    Pass to chatgot via API call
    Return values via JSON format {"brand":"string", "itemName":"string", "cost":float64, "iso4217CurrencyCode":"string"}

## Prompt: 
Extract the brand name, item name, total cost, and currency from the receipt image. Use the following structure to return the data:

1. The brand should be the headquarters' name of the company (e.g., Starbucks Corporation for Starbucks).
2. The currency should follow the ISO 4217 format (e.g., MYR for Malaysian Ringgit).

Return the information in this JSON format:

{
  "brand": "{headquarters_name}",
  "item_name": "{product_name}",
  "cost": {total_cost},
  "currency": "{ISO_currency}"
}

## Updated prompt
Extract the brand name, item name, count, individual cost, and currency from the receipt image. Use the following structure to return the data:

The brand should be the headquarters' name of the company (e.g., Starbucks Corporation for Starbucks).
The currency should follow the ISO 4217 format (e.g., MYR for Malaysian Ringgit).
Count field should be added to indicate how many of each item is listed, and the cost should represent the individual price for that item.

Return the information in this JSON format:

[
  {
    "brand": "{headquarters_name}",
    "item_name": "{product_name}",
    "count": {item_count},
    "cost": {individual_cost},
    "currency": "{ISO_currency}"
  }
]

Only return the JSON string code, do not return anything else.

# Possible obstacles to tackle
-What causes most of finance negligience? Parking tickets, small fees that stack up, taking pictures may take too long
- Is there a possibilty for bank api or card API that only sends usage and transactional values?
- how do we identify type of expense? do something banks cant do? Seperate type of expense, neeeds to be convenient and efficient


# Features

## Core features

## Monthly subscription calculation (such as phone bill, network subscription, etc)

### Expense tracking

### Budgeting

### Finance reports

### Notifications


## Special features
- Gameification (Streaks?)
- Floating block for easy access (perhaps it can show daily available spending?)

## Framework (are we looking at overall fitness app? or )

### Home (fast expense addition)
### Expenses overall
- Expense colour wheel ()
- 
-
## API based functions
- Camera API
- Gallery API
- ChatGPT prompt API

