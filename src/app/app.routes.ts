import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent)
    },
    {
        path: 'recipe-creation',
        loadComponent: () =>
            import('./components/recipe-creation/recipe-creation.component').then(m => m.RecipeCreationComponent)
    }
];
