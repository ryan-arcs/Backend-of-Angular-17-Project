import { ColumnFilter, ColumnFilterCondition } from "../interfaces";

/**
 * Single optimized function to build column filters SQL
 * Handles all filter types and conditions in one place
 */
export const buildColumnFilterWhereClause = (columnFilters: ColumnFilter[], placeHolders: any[], globalColumnFilterOperator?: string): string => {
  if (!columnFilters || columnFilters.length === 0) {
    return '';
  }

   // Smart detection: Common JSONB column name patterns
  const detectJsonbColumn = (columnName: string): boolean => {
    const jsonbPatterns = [
      // Exact matches for known JSONB columns
      'business_owners',
      'system_owners', 
      'product_owners',
      'product_managers',
      'it_contacts'
    ];

    return jsonbPatterns.some(pattern => {
      if (pattern.startsWith('_')) {
        // Pattern match: column ends with this pattern
        return columnName.endsWith(pattern);
      } else {
        // Exact match or contains pattern
        return columnName === pattern || columnName.includes(pattern);
      }
    });
  };
  
  // Helper function to build the appropriate column reference
  const getColumnReference = (columnName: string): string => {
    if (detectJsonbColumn(columnName)) {
      // Cast JSONB to text for text-based operations
      return `${columnName}::text`;
    }
    return columnName;
  };

  // Optimized condition patterns mapping
  const buildConditionSQL = (condition: ColumnFilterCondition, columnName: string): string => {
    const { type, searchTags } = condition;
    
    if (!searchTags || searchTags.length === 0) return '';

    const conditions: string[] = [];
    const columnRef = getColumnReference(columnName);
    const isJsonb = detectJsonbColumn(columnName);

    // Process each search tag
    searchTags.forEach(tag => {
      if (!tag || tag.trim() === '') return;

      let sqlCondition = '';
      
      switch (type) {
        case 'contains':
          placeHolders.push(`%${tag}%`);
          sqlCondition = `${columnRef} ILIKE $${placeHolders.length}`;
          break;
        
        case 'does_not_contain':
          placeHolders.push(`%${tag}%`);
          sqlCondition = `${columnRef} NOT ILIKE $${placeHolders.length}`;
          break;
        
        case 'equals':
          placeHolders.push(tag);
          if (isJsonb) {
            // For JSONB, use ILIKE for flexible matching
            placeHolders[placeHolders.length - 1] = `%${tag}%`;
            sqlCondition = `${columnRef} ILIKE $${placeHolders.length}`;
          } else {
            sqlCondition = `${columnRef} = $${placeHolders.length}`;
          }
          break;
        
        case 'does_not_equal':
          placeHolders.push(tag);
          if (isJsonb) {
            placeHolders[placeHolders.length - 1] = `%${tag}%`;
            sqlCondition = `${columnRef} NOT ILIKE $${placeHolders.length}`;
          } else {
            sqlCondition = `${columnRef} != $${placeHolders.length}`;
          }
          break;
        
        case 'begins_with':
          placeHolders.push(`${tag}%`);
          sqlCondition = `${columnRef} ILIKE $${placeHolders.length}`;
          break;
        
        case 'ends_with':
          placeHolders.push(`%${tag}`);
          sqlCondition = `${columnRef} ILIKE $${placeHolders.length}`;
          break;
        
        case 'is_blank':
          // For JSONB arrays, check if empty array or null
          sqlCondition = isJsonb ? `(${columnName} IS NULL OR ${columnName} = '[]'::jsonb OR jsonb_array_length(${columnName}) = 0)` : `(${columnName} IS NULL OR ${columnName} = '')`;
          break;
        
        case 'is_not_blank':
          // For JSONB arrays, check if has elements
          sqlCondition = isJsonb ? `(${columnName} IS NOT NULL AND ${columnName} != '[]'::jsonb AND jsonb_array_length(${columnName}) > 0)` : `(${columnName} IS NOT NULL AND ${columnName} != '')`;
          break;
        
        default:
          console.warn(`Unknown condition type: ${type}`);
          return;
      }
      
      if (sqlCondition) {
        conditions.push(sqlCondition);
      }
    });

    // Multiple search tags in one condition are joined with OR
    return conditions.length > 1 ? `(${conditions.join(' OR ')})` : conditions[0] || '';
  };

  // Process all column filters
  const filterConditions: string[] = [];

  columnFilters.forEach(filter => {
    if (!filter.columnName || !filter.conditions || filter.conditions.length === 0) {
      return;
    }

    const columnConditions: string[] = [];

    // Process each condition for this column
    filter.conditions.forEach(condition => {
      const conditionSQL = buildConditionSQL(condition, filter.columnName);
      if (conditionSQL) {
        columnConditions.push(conditionSQL);
      }
    });

    if (columnConditions.length > 0) {
      const operator = (filter.operator || 'and').toUpperCase();
      const joinedConditions = columnConditions.length > 1 
        ? `(${columnConditions.join(` ${operator} `)})`
        : columnConditions[0];
      filterConditions.push(joinedConditions);
    }
  });

  const globalOperator = (globalColumnFilterOperator || 'AND').toUpperCase();

  return filterConditions.length > 0 ? `(${filterConditions.join(` ${globalOperator} `)})` : '';
};