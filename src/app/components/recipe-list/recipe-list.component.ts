import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

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
}
