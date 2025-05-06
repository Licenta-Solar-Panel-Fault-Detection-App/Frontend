import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UploadImageComponent} from './pages/upload-image/upload-image.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
//import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UploadImageComponent, NavbarComponent, SidebarComponent], //, ClipboardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
