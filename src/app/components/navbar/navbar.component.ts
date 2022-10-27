import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  unset(){
    sessionStorage.setItem("id","")
    sessionStorage.setItem("jwt","")
    sessionStorage.setItem("type","")
  }

}
