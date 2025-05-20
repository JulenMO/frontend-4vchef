import { Ingredient } from './ingredient.model';
import { Step } from './step.model';
import { NutritionalValue } from './nutritional-value.model';
import { Rating } from './rating.model';

export interface Recipe {
    id: number;
    title: string;
    numberDiner: number;
    ingredients: Ingredient[];
    steps: Step[];
    nutritional: NutritionalValue;
    ratings: Rating[];
}