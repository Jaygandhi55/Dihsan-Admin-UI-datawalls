import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  loading: boolean = false; // Flag variable
  
  selectedCompanies:any;
  companies: any[] = [];
  companiesNames = ['Uber', 'Microsoft', 'Flexigen'];

  constructor() { }

  ngOnInit(): void {
  }

  //
  addTagPromise(name:any) {
    return new Promise((resolve) => {
        this.loading = true;
        // Simulate backend call.
        setTimeout(() => {
            resolve({ id: 5, name: name, valid: true });
            this.loading = false;
        }, 1000);
    })
  }

}
