import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-creation.component.html'
})
export class RecipeCreationComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private recipeService: RecipeService, private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      numberDiner: [1, [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
      nutrients: this.fb.array([])
    });
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.form.get('steps') as FormArray;
  }

  get nutrients(): FormArray {
    return this.form.get('nutrients') as FormArray;
  }

  get completeValidForm(): boolean {
    return this.form.valid &&
      this.ingredients.length > 0 &&
      this.steps.length > 0 &&
      this.nutrients.length > 0;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      unit: ['', Validators.required]
    }));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addStep(): void {
    this.steps.push(this.fb.group({
      stepOrder: [this.steps.length + 1, Validators.required],
      description: ['', Validators.required]
    }));
  }

  removeStep(index: number): void {
    this.steps.removeAt(index);
  }

  addNutrient(): void {
    this.nutrients.push(this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeNutrient(index: number): void {
    this.nutrients.removeAt(index);
  }

  submit(): void {
    if (!this.completeValidForm) return;

    this.recipeService.create(this.form.value).subscribe({
      next: () => {
        alert('Receta creada con éxito');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Error al crear receta:', err);
        alert('Error al crear receta');
      }
    });
  }
}
