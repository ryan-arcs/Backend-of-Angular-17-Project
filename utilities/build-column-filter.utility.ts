import { ColumnFilter, ColumnFilterCondition } from "../interfaces";

/**
 * Single optimized function to build column filters SQL
 * Handles all filter types and conditions in one place
 */
export const buildColumnFilterWhereClause = (columnFilters: ColumnFilter[], placeHolders: any[]): string => {
  if (!columnFilters || columnFilters.length === 0) {
    return '';
  }

  // Optimized condition patterns mapping
  const buildConditionSQL = (condition: ColumnFilterCondition, columnName: string): string => {
    const { type, searchTags } = condition;
    
    if (!searchTags || searchTags.length === 0) return '';

    const conditions: string[] = [];

    // Process each search tag
    searchTags.forEach(tag => {
      if (!tag || tag.trim() === '') return;

      let sqlCondition = '';
      
      switch (type) {
        case 'contains':
          placeHolders.push(`%${tag}%`);
          sqlCondition = `${columnName} ILIKE $${placeHolders.length}`;
          break;
        
        case 'does_not_contain':
          placeHolders.push(`%${tag}%`);
          sqlCondition = `${columnName} NOT ILIKE $${placeHolders.length}`;
          break;
        
        case 'equals':
          placeHolders.push(tag);
          sqlCondition = `${columnName} = $${placeHolders.length}`;
          break;
        
        case 'does_not_equal':
          placeHolders.push(tag);
          sqlCondition = `${columnName} != $${placeHolders.length}`;
          break;
        
        case 'begins_with':
          placeHolders.push(`${tag}%`);
          sqlCondition = `${columnName} ILIKE $${placeHolders.length}`;
          break;
        
        case 'ends_with':
          placeHolders.push(`%${tag}`);
          sqlCondition = `${columnName} ILIKE $${placeHolders.length}`;
          break;
        
        case 'is_blank':
          sqlCondition = `(${columnName} IS NULL OR ${columnName} = '')`;
          break;
        
        case 'is_not_blank':
          sqlCondition = `(${columnName} IS NOT NULL AND ${columnName} != '')`;
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

  return filterConditions.length > 0 ? `(${filterConditions.join(' AND ')})` : '';
};