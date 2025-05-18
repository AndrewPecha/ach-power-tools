import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

interface GridData {
  IncorrectValue: string;
  CorrectedValue: string;
  CCode: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ach-power-tools-ui';
  gridData: GridData[] = [];

  constructor(private http: HttpClient) {
  }

  refreshData() {
    this.http.get<GridData[]>('http://localhost:8080/get-noc-entries')
      .subscribe({
        next: (data) => {
          this.gridData = data;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
  }
}
