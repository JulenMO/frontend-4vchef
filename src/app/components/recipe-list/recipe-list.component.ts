import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;

  minCalories: number | null = null;
  maxCalories: number | null = null;
  minRating: number | null = null;
  maxRating: number | null = null;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = data;
      },
      error: (err) => console.error('Error al cargar recetas', err)
    });
  }

  getAverageRating(recipe: Recipe): number {
    if (!recipe.ratings.length) return 0;
    const sum = recipe.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sum / recipe.ratings.length;
  }

  getCalories(recipe: Recipe): number {
    const cal = recipe.nutrients.find(n => n.name.toLowerCase() === 'calories');
    return cal ? cal.amount : 0;
  }

  applyFilters(): void {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const cal = this.getCalories(recipe);
      const avg = this.getAverageRating(recipe);

      const calOk = (this.minCalories === null || cal >= this.minCalories) &&
        (this.maxCalories === null || cal <= this.maxCalories);
      const ratingOk = (this.minRating === null || avg >= this.minRating) &&
        (this.maxRating === null || avg <= this.maxRating);

      return calOk && ratingOk;
    });
  }

  resetFilters(): void {
    this.minCalories = null;
    this.maxCalories = null;
    this.minRating = null;
    this.maxRating = null;
    this.filteredRecipes = [...this.recipes];
  }

  openModal(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    const modal = new (window as any).bootstrap.Modal('#recipeModal');
    modal.show();
  }

  rateRecipe(recipeId: number, value: number): void {
    this.recipeService.rate(recipeId, value).subscribe({
      next: (updatedRecipe) => {
        const index = this.recipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
          this.applyFilters();
          if (this.selectedRecipe && this.selectedRecipe.id === recipeId) {
            this.selectedRecipe = updatedRecipe;
          }
        }
      },
      error: (err) => console.error('Error al valorar receta', err)
    });
  }
}
