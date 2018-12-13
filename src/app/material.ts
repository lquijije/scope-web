
import { NgModule } from '@angular/core';
import { MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatIconModule} from '@angular/material';

@NgModule({
    imports: [MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatIconModule],
    exports: [MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatIconModule]
})

export class MaterialModule { }