import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/recipes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  create(recipe: any): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  rate(recipeId: number, value: number): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${recipeId}/rating/${value}`, {});
  }
}
