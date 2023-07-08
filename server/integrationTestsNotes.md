# Adding entry should increase length
- Transaction ✅
- Category ✅
- Matchers ✅

# Deleting entry should decrease length
- Transaction
- Category
- Matchers

# Deleting should impact related tables
- Category
    - remove id from Transaction
    - remove rows from category_matcher
- Matcher
    - remove rows from category_matcher

# Adding graph entry should insert graph
- Transaction -> Category -> Matchers ✅
- Category -> Matchers

# Editing
- Edit Transaction should assign but not modify Category
- Edit Category
- Edit Matcher