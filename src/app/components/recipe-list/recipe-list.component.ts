import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

declare var bootstrap: any;

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
  recipeToVote: Recipe | null = null;

  minCalories: number | null = null;
  maxCalories: number | null = null;
  minRating: number | null = null;
  maxRating: number | null = null;

  @ViewChild('recipeModal') recipeModalRef!: ElementRef;
  @ViewChild('voteModal') voteModalRef!: ElementRef;

  recipeModal: any;
  voteModal: any;

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

  ngAfterViewInit(): void {
    this.recipeModal = new bootstrap.Modal(this.recipeModalRef.nativeElement);
    this.voteModal = new bootstrap.Modal(this.voteModalRef.nativeElement);
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
    this.recipeModal.show();
  }

  openVoteModal(recipe: Recipe): void {
    this.recipeToVote = recipe;
    this.voteModal.show();
  }

  alreadyVoted(recipeId: number): boolean {
    return localStorage.getItem(`voted-${recipeId}`) === 'true';
  }

  vote(recipeId: number, value: number): void {
    if (this.alreadyVoted(recipeId)) return;

    this.recipeService.rate(recipeId, value).subscribe({
      next: (updatedRecipe) => {
        localStorage.setItem(`voted-${recipeId}`, 'true');

        const index = this.recipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
          this.applyFilters();
          if (this.selectedRecipe?.id === recipeId) {
            this.selectedRecipe = updatedRecipe;
          }
        }

        this.voteModal.hide();
      },
      error: (err) => console.error('Error al valorar receta', err)
    });
  }
}
