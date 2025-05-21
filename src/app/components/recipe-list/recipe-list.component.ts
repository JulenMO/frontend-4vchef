import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];

  minCalories: number | null = null;
  maxCalories: number | null = null;
  minRating: number | null = null;

  selectedRecipe: Recipe | null = null;
  showCreateForm: boolean = false;

  newRecipe: any = {
    title: '',
    numberDiner: 1,
    ingredients: [{ name: '', quantity: 0, unit: '' }],
    steps: [{ description: '', order: 1 }],
    nutritional: {
      calories: 0,
      saturatedFat: 0,
      otherFat: 0,
      carbs: 0,
      protein: 0,
      fiber: 0,
      salt: 0
    },
    ratings: []
  };

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
        this.applyFilters();
      },
      error: (err) => console.error('Error al cargar recetas:', err)
    });
  }

  getAverageRating(recipe: Recipe): number {
    if (!recipe.ratings.length) return 0;
    const total = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
    return Math.round(total / recipe.ratings.length);
  }

  applyFilters(): void {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const cal = recipe.nutritional.calories;
      const rating = this.getAverageRating(recipe);

      const matchCalories =
        (this.minCalories === null || cal >= this.minCalories) &&
        (this.maxCalories === null || cal <= this.maxCalories);

      const matchRating =
        this.minRating === null || rating >= this.minRating;

      return matchCalories && matchRating;
    });
  }

  openDetail(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  closeDetail(): void {
    this.selectedRecipe = null;
  }

  openCreateForm(): void {
    this.resetNewRecipe();
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  addIngredient(): void {
    this.newRecipe.ingredients.push({ name: '', quantity: 0, unit: '' });
  }

  addStep(): void {
    this.newRecipe.steps.push({ description: '', order: this.newRecipe.steps.length + 1 });
  }

  resetNewRecipe(): void {
    this.newRecipe = {
      title: '',
      numberDiner: 1,
      ingredients: [{ name: '', quantity: 0, unit: '' }],
      steps: [{ description: '', order: 1 }],
      nutritional: {
        calories: 0,
        saturatedFat: 0,
        otherFat: 0,
        carbs: 0,
        protein: 0,
        fiber: 0,
        salt: 0
      },
      ratings: []
    };
  }

  saveRecipe(): void {
    if (this.newRecipe.ingredients.length < 1 || this.newRecipe.steps.length < 1) {
      alert('Debes tener al menos 1 ingrediente y 1 paso.');
      return;
    }

    this.recipeService.create(this.newRecipe).subscribe({
      next: (created) => {
        this.recipes.push(created);
        this.applyFilters();
        this.closeCreateForm();
      },
      error: (err) => {
        console.error('Error al guardar receta:', err);
        alert('Error al guardar receta.');
      }
    });
  }
}
