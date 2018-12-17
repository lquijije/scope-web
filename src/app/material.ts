
import { NgModule } from '@angular/core';
import { MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule} from '@angular/material';

@NgModule({
    imports: [MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule],
    exports: [MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatGridListModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule]
})

export class MaterialModule { }