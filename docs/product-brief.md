# Product brief: Split the Bill

**Problem.** When friends travel or go out together, different people pay for different things
(hotel, dinner, fuel). Afterwards nobody knows who owes whom, and settling up is messy.

**Users.** Groups of friends, flatmates and classmates who share costs.

**Solution.** A mobile app where a group records shared expenses, the app splits each one
(equally or by custom amounts), keeps a live balance for every member, and suggests the fewest
payments needed to settle up.

## Functional requirements (login/sign-up excluded)
1. Create a group and add its members.
2. Add an expense: title, amount, payer, category and the members who share it.
3. Split an expense equally or by custom amounts that must add up to the total.
4. View each member's balance (who owes, who gets back) and suggested payments.
5. Record a settlement (payment between two members) and update balances.
6. View the expense list, expense details and payment history of a group.
7. View spending statistics by category and by payer.

## Screen map (9 screens, 3 per member)
| # | Screen | Feature | Member |
|---|---|---|---|
| 1 | Home (groups list) | groups | A |
| 2 | Create Group | groups | A |
| 3 | Group Details | groups | A |
| 4 | Add Expense | expenses | B |
| 5 | Expense Details | expenses | B |
| 6 | Statistics | expenses | B |
| 7 | Balances | settlements | C |
| 8 | Settle Up | settlements | C |
| 9 | Payment History | settlements | C |

Flow: Home → Create Group → Group Details → Add Expense → Expense Details / Statistics →
Balances → Settle Up → Payment History.
