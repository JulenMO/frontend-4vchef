import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  imports: [CommonModule],
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  getAverageRating(recipe: Recipe): number {
    if (!recipe.ratings.length) return 0;
    const total = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
    return Math.round(total / recipe.ratings.length);
  }

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({
      next: (data) => this.recipes = data,
      error: (err) => console.error('Error al cargar recetas:', err)
    });
  }
}
