## Usage

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

## Excersise

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

**For example:**

Given the check-in date is `2019-12-25` and `input.json` has following content:

```json
{
  "offers": [
    {
      "id": 1,
      "title": "Offer 1",
      "description": "Offer 1 description",
      "category": 1,
      "merchants": [
        {
          "id": 1,
          "name": "Offer1 Merchant1",
          "distance": 0.5
        }
      ],
      "valid_to": "2020-02-01"
    },
    {
      "id": 2,
      "title": "Offer 2",
      "description": "Offer 2 description",
      "category": 2,
      "merchants": [
        {
          "id": 2,
          "name": "Offer2 Merchant1",
          "distance": 1.3
        }
      ],
      "valid_to": "2019-12-01"
    },
    {
      "id": 3,
      "title": "Offer 3",
      "description": "Offer 3 description",
      "category": 2,
      "merchants": [
        {
          "id": 3,
          "name": "Offer3 Merchant1",
          "distance": 0.8
        },
        {
          "id": 4,
          "name": "Offer3 Merchant2",
          "distance": 0.9
        }
      ],
      "valid_to": "2020-01-01"
    },
    {
      "id": 4,
      "title": "Offer 4",
      "description": "Offer 4 description",
      "category": 3,
      "merchants": [
        {
          "id": 5,
          "name": "Offer4 Merchant1",
          "distance": 0.3
        }
      ],
      "valid_to": "2020-05-01"
    },
    {
      "id": 5,
      "title": "Offer 5",
      "description": "Offer 5 description",
      "category": 4,
      "merchants": [
        {
          "id": 6,
          "name": "Offer5 Merchant1",
          "distance": 1.2
        }
      ],
      "valid_to": "2020-05-01"
    },
    {
      "id": 6,
      "title": "Offer 6",
      "description": "Offer 6 description",
      "category": 2,
      "merchants": [
        {
          "id": 7,
          "name": "Offer6 Merchant1",
          "distance": 1.3
        }
      ],
      "valid_to": "2020-05-01"
    }
  ]
}
```

Then the expected `output.json` has the following content:

```json
{
  "offers": [
    {
      "id": 1,
      "title": "Offer 1",
      "description": "Offer 1 description",
      "category": 1,
      "merchants": [
        {
         "id": 1,
         "name": "Offer1 Merchant1",
         "distance": 0.5
        }
      ],
      "valid_to": "2020-02-01"
    },
    {
      "id": 3,
      "title": "Offer 3",
      "description": "Offer 3 description",
      "category": 2,
      "merchants": [
        {
         "id": 3,
         "name": "Offer3 Merchant1",
         "distance": 0.8
        }
      ],
      "valid_to": "2020-01-01"
    }
  ]
}
```

The final result returns Offer ID 1 with Merchant ID 1 & Offer ID 3 with Merchant ID 3 because:

* Offer ID 2 is not valid until the check-in date
* Offer ID 4 is not an eligible category
* Offer ID 3 has two merchants, the closest merchant is merchant id 3. So remove merchant id 4
* So we have Offer id 1, 3, 5, 6 with category id 1, 2, 4, 2
* Offer ID 3 & 6 have the same category id 2. So we choose Offer ID 3 because Offer 3 merchants are closer
* So we have Offer IDs 1, 3, 5. We need to choose only 2 of 3 offers.
* Offer ID 1 & 3 are the closest from 3 of them.

## Requirements

We expect that you don’t use any major framework for
building back-end or front-end applications. This round is mainly for
evaluating your problem-solving aspect by applying foundational computer
 science knowledge.

Note that we’re quite keen on the notion of “don’t
reinvent the wheel”, so even though major frameworks are not allowed,
you’re free to use any library to support your core logic. And you can
work on the exercise using any programming language of your choice.

In order to help us evaluate your submission, do provide a `README.MD` to explain how we can setup the environment and run your application

## Submission

Once you finish the exercise, upload your code to a public
 repository (e.g. GitHub, GitLab, etc.) then send us the repository link
 via email.

## Grading criteria

For grading your submission, we take these points into account:

* Is the logic fully correct? Are edge cases taken into account?
* The extensibility of your code
* Readability
* Performance
