import { Ingredient } from './ingredient.model';
import { Step } from './step.model';
import { Rating } from './rating.model';
import { Nutrient } from './nutrient.model';

export interface Recipe {
    id: number;
    title: string;
    numberDiner: number;
    ingredients: Ingredient[];
    steps: Step[];
    nutrients: Nutrient[];
    ratings: Rating[];
}
