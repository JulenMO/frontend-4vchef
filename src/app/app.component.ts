import { Component, OnInit } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { Recipe } from './models/recipe.model';

@Component({
  selector: 'app-root',
  template: `<p>Ver consola</p>`,
})
export class AppComponent implements OnInit {
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipeService.getAll().subscribe({
      next: (recipes: Recipe[]) => console.log('Recetas:', recipes),
      error: (err) => console.error('Error:', err)
    });
  }
}
