# Product Details Page Bug Fix TODO

## Approved Plan Steps (blackboxai/fix-productdetail-bugs)

- [x] Step 1: Update ProductDetail.jsx ✅
  - Fix +/- button symbols
  - Add weightMultiplier function
  - Compute and display dynamic unitPrice & totalPrice
  - Update handleAddToCart to pass customized product (with weight, unitPrice, totalPrice)

- [x] Step 2: Minor update CartContext.jsx ✅
  - Key addToCart/updateQty by (id + weight) to handle variants

- [x] Step 3: Add CSS for .pd-total-price in ProductDetail.css ✅

- [x] Step 4: Test functionality ✅
  - Dev server running on http://localhost:5175/
  - Navigate to product page (e.g., /product/1)
  - Verify: - decreases qty, + increases
  - Weight change updates unit/total price
  - Add to cart includes weight/unit/total/qty
  - Cart drawer shows updated items

- [ ] Step 5: Commit to new branch and verify
