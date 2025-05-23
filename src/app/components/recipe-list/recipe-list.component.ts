import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule],
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => this.recipes = data,
      error: (err) => console.error('Error al cargar recetas', err)
    });
  }

  openModal(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    const modal = new (window as any).bootstrap.Modal('#recipeModal');
    modal.show();
  }

  getAverageRating(recipe: Recipe): number {
    if (!recipe.ratings.length) return 0;
    const sum = recipe.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sum / recipe.ratings.length;
  }

  rateRecipe(recipeId: number, value: number): void {
    this.recipeService.rate(recipeId, value).subscribe({
      next: (updatedRecipe) => {
        const index = this.recipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
          this.selectedRecipe = updatedRecipe;
        }
      },
      error: (err) => console.error('Error al valorar receta', err)
    });
  }
}
