import { Ingredient } from './ingredient.model';
import { Step } from './step.model';
import { Nutrient } from './nutrient.model';
import { Rating } from './rating.model';

export interface Recipe {
    id: number;
    title: string;
    numberDiner: number;
    ingredients: Ingredient[];
    steps: Step[];
    nutrients: Nutrient[];
    ratings: Rating[];
}
