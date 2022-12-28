import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() control: any;

  roleAccessForm: FormGroup;

  constructor(private fb: FormBuilder) {
    console.log(this.control);
  }

  ngOnInit(): void {
    this.roleAccessForm = this.fb.group({
      read: [this.control.access.read, []],
      write: [this.control.access.write, []]
    })
  }

  changeRead(evt: any) {
    if (this.roleAccessForm.value.read == false) {
      this.roleAccessForm.controls['write'].setValue(false);
    }
  }

  changeWrite(evt: any) {
    if (this.roleAccessForm.value.write == true) {
      this.roleAccessForm.controls['read'].setValue(true);
    }
  }

}
