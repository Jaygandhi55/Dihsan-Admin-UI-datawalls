import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/eclipse';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-project-configuration',
  templateUrl: './project-configuration.component.html',
  styleUrls: ['./project-configuration.component.scss']
})
export class ProjectConfigurationComponent implements OnInit {

  @ViewChild('dihsanField') dihsanField: any;
  spinner = true;
  
  constructor(private productService: ProductService, private toster: ToastrService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.productService.getProjectConfig().subscribe({
      next: (res) => {
        this.dihsanField.text = JSON.stringify(JSON.parse(res.data[0].dihsan_fields), null, 4);
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    });
  }

  updateField() {
    this.spinner = true;
    const req = {
      dihsan_fields : JSON.stringify(JSON.parse(this.dihsanField.text))
    }

    this.productService.postProjectConfig(req).subscribe({
      next: (res) => {
        this.toster.success(res.message, 'Success', { timeOut: 3000 });
      },
      error: (err) => {
        err?.error?.errors[0]?.message ? this.toster.error(err?.error?.errors[0].message, 'Error', { timeOut: 3000 }) :
          this.toster.error('', 'Error', { timeOut: 3000 });
      }
    }).add(() => {
      this.spinner = false;
    })
  }

}
