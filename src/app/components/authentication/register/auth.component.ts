import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  hide: boolean = false;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  registerForm: FormGroup = this.fb.group(
    {
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(8)]],
    }
  )

  onRegister()
  {
    if (!this.registerForm.valid)
      {
        return;
      }
    console.log(this.registerForm.value);
  }



}
