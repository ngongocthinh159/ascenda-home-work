# Usage

Locate to root folder, install dependencies:

```
npm install
```



Mocking data by copying and pasting data into "./src/input.json". Note that the input data must be a valid JSON format or the program will stop and notify the error.



Run program to filter the best offers from input data, by specify check-in date in command line. For example:

```
npm start 2019-12-25
```



The result will be printed in the console and also can be found in "./src/output.json".


# Excersise

Given that the JSON response mentioned above is already loaded inside a file `input.json`, implement a command line application that:

* Accept an argument which is the customer check-in date with the format: `YYYY-MM-DD`
* Load the `input.json` file
* Filter the offers via the following rules:
  * Only select offers with category that is `Restaurant`, `Retail` or `Activity`. Category ID mapping is
    ```
    Restaurant: 1 
    Retail: 2
    Hotel: 3
    Activity: 4
    ```
  * Offer needs to be valid till checkin date + 5 days. (valid_to is in `YYYY-MM-DD`)
  * If an offer is available in multiple merchants, only select the closest merchant
  * This class should only return 2 offers even though there are several eligible offers
  * Both final selected offers should be in different
    categories. If there are multiple offers in the same category give
    priority to the closest merchant offer.
  * If there are multiple offers with different categories, select the closest merchant offers when selecting 2 offers
* Finally, save the filtered offers to a file `output.json` (stored at the root of the project)
