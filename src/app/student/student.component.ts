import { ApiService } from './../services/api.service';
import { StudentModel } from './student.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  formValue!: FormGroup;
  studentModelObj: StudentModel = new StudentModel();
  studentData!: any;
  showAdd!: boolean;
  showUpdate!: boolean;

  constructor(private formbuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pageLength: 10,
      lengthChange: false,
    };
    this.formValue = this.formbuilder.group({
      name: [''],
      email: [''],
      phone: [],
      fees: [''],
    });
    this.getAllStudents();
  }
  clickAddStudent() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postStudentDetails() {
    this.studentModelObj.name = this.formValue.value.name;
    this.studentModelObj.email = this.formValue.value.email;
    this.studentModelObj.phone = this.formValue.value.phone;
    this.studentModelObj.fees = this.formValue.value.fees;
    this.api.postStudent(this.studentModelObj).subscribe(
      (res) => {
        console.log(res);
        alert('Students record added successfully!');
        // for reset after adding data
        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        //for instant update data after adding
        this.getAllStudents();
      },
      (err) => {
        alert('something went wrong');
      }
    );
  }

  getAllStudents() {
    this.api.getStudents().subscribe((res) => {
      this.studentData = res;
    });
  }

  deleteStudents(stu: any) {
    this.api.deleteStudent(stu.id).subscribe((res) => {
      alert('Student record deleted');
      this.getAllStudents();
    });
  }

  onEdit(stu: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.studentModelObj.id = stu.id;
    this.formValue.controls['name'].setValue(stu.name);
    this.formValue.controls['email'].setValue(stu.email);
    this.formValue.controls['phone'].setValue(stu.phone);
    this.formValue.controls['fees'].setValue(stu.fees);
  }

  updateStudentDetails() {
    this.studentModelObj.name = this.formValue.value.name;
    this.studentModelObj.email = this.formValue.value.email;
    this.studentModelObj.phone = this.formValue.value.phone;
    this.studentModelObj.fees = this.formValue.value.fees;

    this.api
      .updateStudent(this.studentModelObj, this.studentModelObj.id)
      .subscribe((res) => {
        alert('Student record updated successfully');

        let ref = document.getElementById('cancel');
        ref?.click();
        this.formValue.reset();
        this.getAllStudents(); //for instant update data after updating
      });
  }
}
