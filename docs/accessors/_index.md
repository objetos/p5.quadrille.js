---
title: "Accessors"
weight: 4
---

**Accessor methods** are powerful tools for extracting information or creating modified versions of a `quadrille` instance. These methods are strictly **non-mutative**, ensuring the original quadrille remains unchanged while offering detailed insights or generating derivative instances.

### **Queries**
[Query methods](queries/) provide computations and insights into the quadrille's structure. These include operations such as **[search(pattern, strict)](queries/search/)** for finding cells matching specific patterns, **[magnitude(row)](queries/magnitude/)** to calculate the number of non-empty cells in a row, and **[screenRow(pixelY, y, cellLength)](queries/screen_row/)** or **[screenCol(pixelX, x, cellLength)](queries/screen_col/)** for mapping pixel positions to grid indices.

### **Cell Contents**
[Cell content accessors](cell_contents/) focus on retrieving information about the value and type of individual cells. You can use **[read(row, col)](cell_contents/read/)** to access a cell's content, or methods like **[isValid(row, col)](cell_contents/is_valid/)**, **[isEmpty(row, col)](cell_contents/is_empty/)**, **[isFilled(row, col)](cell_contents/is_filled/)**, **[isString(row, col)](cell_contents/is_string/)**, **[isNumber(row, col)](cell_contents/is_number/)**, **[isColor(row, col)](cell_contents/is_color/)**, **[isImage(row, col)](cell_contents/is_image/)**, **[isArray(row, col)](cell_contents/is_array/)**, **[isFunction(row, col)](cell_contents/is_function/)**, and **[isObject(row, col)](cell_contents/is_object/)** to determine the type of data in a specific cell.

### **Instance Creators**
[Instance creator methods](instance_creators/) generate new quadrille instances derived from the original. These include **[clone()](instance_creators/clone/)** to create a shallow copy, **[row(row)](instance_creators/row/)** to extract a specific row, **[crop(row, col, width, height, wrap)](instance_creators/crop/)** to extract a rectangular region, and **[ring(row, col, dimension, wrap)](instance_creators/ring/)** a square neighborhood centered at a specified position — center cell included.

Through these categories, accessor methods provide a comprehensive way to analyze and derive data from quadrille instances without altering their original state.
