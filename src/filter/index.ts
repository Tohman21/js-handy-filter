import ConditionParser from 'condition-parser';
import { and, or } from 'conditions';
import { CheckableValue, Condition, ICondition } from 'conditions/types';
import { isArray } from 'lib/type-guards';

import { FilterOptions } from './types';

/**
 * The Filter class.
 *
 * The Filter filters arrays using the "Condition syntax",
 *  which allow to work in a declarative style.
 */
export default class Filter {
  private conditionStack: ICondition[] = [];
  private readonly options: Required<FilterOptions>;

  constructor(conditions: Condition | Condition[], options: FilterOptions = {}) {
    const parsed = ConditionParser.parse(conditions as any);

    if (isArray(parsed)) {
      this.conditionStack = parsed;
    } else {
      this.conditionStack = [parsed];
    }

    this.options = {
      addTo: options.addTo || 'latest',
    };
  }

  /**
   * The method for filtering arrays.
   *
   * @param target - The array to filter;
   */
  public filter = <Type extends CheckableValue>(target: Type[]) => {
    const { conditionStack } = this;
    const condition = conditionStack.length === 1 ? conditionStack[0] : or(...conditionStack);

    return conditionStack.length !== 0 ? target.filter(condition.check) : target;
  };

  /**
   * The method for adding new conditions to the filter through logical "and".
   *
   * By default the method add new conditions to the latest available condition in the filter.
   * See FilterOptions.addTo to change this behavior.
   *
   * @param conditions - New conditions for filtering;
   */
  public and = (...conditions: Condition[]) => {
    const { conditionStack, options } = this;
    const parsedConditions = ConditionParser.parse(conditions);

    const stack = [...conditionStack];
    const latestCondition = stack.pop();
    const filter = new Filter([], options);

    stack.push(latestCondition ? and(latestCondition, ...parsedConditions) : and(...parsedConditions));
    filter.conditionStack = stack;

    return filter;
  };

  /**
   * The method for adding new conditions to the filter through logical "or".
   *
   * By default the method add new conditions to the latest available condition in the filter.
   * See FilterOptions.addTo to change this behavior.
   *
   * @param conditions - New conditions for filtering;
   */
  public or = (...conditions: Condition[]) => {
    const { conditionStack, options } = this;
    const stack = [...conditionStack];
    const filter = new Filter([], options);

    stack.push(...ConditionParser.parse(conditions));
    filter.conditionStack = options.addTo === 'all' ? [or(...stack)] : stack;

    return filter;
  };
}
