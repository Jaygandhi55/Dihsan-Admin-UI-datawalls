import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwitcherService } from '../../services/switcher.service';
import * as switcher from './switcher';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
})
export class SwitcherComponent implements OnInit {
  layoutSub: Subscription;

  body = document.querySelector('body');

  @ViewChild('switcher', { static: false }) switcher!: ElementRef;
  constructor(
    public renderer: Renderer2,
    public switcherServic: SwitcherService
  ) {
    this.layoutSub = switcherServic.changeEmitted.subscribe((value) => {
      if (value) {
        this.renderer.addClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','0px');
        value = true;
      } else {
        this.renderer.removeClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','-270px');
        value = false;
      }
    });
  }
  ngOnInit(): void {
    switcher.localStorageBackUp();
    switcher.customClickFn();
    switcher.updateChanges();
  }
  reset(){
    localStorage.clear(); 
    let html:any = document.querySelector('html')
    let body = document.querySelector('body')
    html.style = ''; 
    body?.classList.remove('dark-theme');
    body?.classList.remove('transparent-theme');
    body?.classList.remove('light-header');
    body?.classList.remove('dark-header');
    body?.classList.remove('color-header');
    body?.classList.remove('gradient-header');
    body?.classList.remove('light-menu');
    body?.classList.remove('color-menu');
    body?.classList.remove('dark-menu');
    body?.classList.remove('gradient-menu');
    body?.classList.remove('layout-boxed');
    body?.classList.remove('scrollable-layout');
    body?.classList.remove('bg-img1');
    body?.classList.remove('bg-img2');
    body?.classList.remove('bg-img3');
    body?.classList.remove('bg-img4');
    switcher.updateChanges();
    switcher.checkOptions();
    let primaryColorVal = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();
    
    document.querySelector('html')?.style.setProperty('--primary-bg-color', primaryColorVal);
  
  }

  public color1: string = '#38cab3';
  public color2: string = '#38cab3';
  public color3: string = '#38cab3';
  public color4: string = '#38cab3';
  public color5: string = '#38cab3';

  public dynamicLightPrimary(data: any): void {
    this.color1 = data.color;

    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');

    switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);
    
    localStorage.setItem('light-primary-color', this.color1);
    localStorage.setItem('light-primary-hover', this.color1);
    localStorage.setItem('light-primary-border', this.color1);
    let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
    light.checked = true;

    // Adding
    this.body?.classList.add('light-theme');
    localStorage.setItem('LightTheme', 'true');
    
    // removing
    localStorage.removeItem('DarkTheme');
    localStorage.removeItem('TransparentTheme');
    this.body?.classList.remove('dark-theme');
    this.body?.classList.remove('transparent-theme');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4');
    
    localStorage.removeItem('dark-primary-color');
    localStorage.removeItem('transparent-primary-color');
    localStorage.removeItem('transparent-bg-color');
    localStorage.removeItem('transparent-bgImg-primary-color');
    localStorage.removeItem('BgImage');
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicDarkPrimary(data: any): void {
    this.color2 = data.color;

    const dynamicPrimaryDark = document.querySelectorAll('input.color-primary-dark');

    switcher.dynamicDarkPrimaryColor(dynamicPrimaryDark, this.color2);
    
    localStorage.setItem('dark-primary-color', this.color2);
    let dark = document.getElementById('myonoffswitch2') as HTMLInputElement;
    dark.checked = true;

    // Adding
    this.body?.classList.add('dark-theme');
    localStorage.setItem('DarkTheme', 'true');
    
    // removing
    localStorage.removeItem('LightTheme');
    localStorage.removeItem('TransparentTheme');
    this.body?.classList.remove('light-theme');
    this.body?.classList.remove('transparent-theme');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4');    
    
    localStorage.removeItem('light-primary-color');
    localStorage.removeItem('light-primary-hover');
    localStorage.removeItem('light-primary-border');
    localStorage.removeItem('transparent-primary-color');
    localStorage.removeItem('transparent-bg-color');
    localStorage.removeItem('transparent-bgImg-primary-color');
    localStorage.removeItem('BgImage');
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicTranparentPrimary(data: any): void {
    this.color3 = data.color;

    const dynamicPrimaryTrasnsparent = document.querySelectorAll('input.color-primary-transparent');

    switcher.dynamicTrasnsparentPrimaryColor(
      dynamicPrimaryTrasnsparent,
      this.color3
    );
    localStorage.setItem('transparent-primary-color', this.color3);
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;

    // Adding
    this.body?.classList.add('transparent-theme');
    localStorage.setItem('TransparentTheme', 'true');
    
    // Removing
    localStorage.removeItem('DarkTheme');
    localStorage.removeItem('LightTheme');
    this.body?.classList.remove('light-theme');
    this.body?.classList.remove('dark-theme');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');   

    localStorage.removeItem('light-primary-color');
    localStorage.removeItem('light-primary-hover');
    localStorage.removeItem('light-primary-border');
    localStorage.removeItem('dark-primary-color');
    localStorage.removeItem('transparent-bg-color');
    localStorage.removeItem('transparent-bgImg-primary-color');
    localStorage.removeItem('BgImage');
    switcher.removeForTransparent();
    switcher.updateChanges();
  }
  public dynamicTranparentBgPrimary(data: any): void {
    this.color4 = data.color;

    const dynamicPrimaryBgTrasnsparent = document.querySelectorAll('input.color-bg-transparent');

    switcher.dynamicBgTrasnsparentPrimaryColor(
      dynamicPrimaryBgTrasnsparent,
      this.color4
    );
    localStorage.setItem('transparent-bg-color', this.color4);
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;

    // Adding
    this.body?.classList.add('transparent-theme');
    localStorage.setItem('TransparentTheme', 'true');
    
    // Removing
    localStorage.removeItem('DarkTheme');
    localStorage.removeItem('LightTheme');
    this.body?.classList.remove('light-theme');
    this.body?.classList.remove('dark-theme');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');

    localStorage.removeItem('light-primary-color');
    localStorage.removeItem('light-primary-hover');
    localStorage.removeItem('light-primary-border');
    localStorage.removeItem('dark-primary-color');
    localStorage.removeItem('transparent-bgImg-primary-color');
    localStorage.removeItem('BgImage');
    switcher.removeForTransparent();
    switcher.updateChanges();
  }
  public dynamicTranparentImgPrimary(data: any): void {
    this.color5 = data.color;

    const dynamicPrimaryBgImgTrasnsparent = document.querySelectorAll('input.color-primary-transparent-img');

    switcher.dynamicBgImgTrasnsparentPrimaryColor(
      dynamicPrimaryBgImgTrasnsparent,
      this.color5
    );
    
    localStorage.setItem('transparent-bgImg-primary-color', this.color5);
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;

    if (
      document.querySelector('body')?.classList.contains('bg-img1') == false &&
      document.querySelector('body')?.classList.contains('bg-img2') == false &&
      document.querySelector('body')?.classList.contains('bg-img3') == false &&
      document.querySelector('body')?.classList.contains('bg-img4') == false
    ) {
      document.querySelector('body')?.classList.add('bg-img1');
      localStorage.setItem('BgImage', 'bg-img1');
    }
    // Adding
    this.body?.classList.add('transparent-theme');
    localStorage.setItem('TransparentTheme', 'true');
    
    // Removing
    localStorage.removeItem('DarkTheme');
    localStorage.removeItem('LightTheme');
    this.body?.classList.remove('light-theme');
    this.body?.classList.remove('dark-theme'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');

    localStorage.removeItem('light-primary-color');
    localStorage.removeItem('light-primary-hover');
    localStorage.removeItem('light-primary-border');
    localStorage.removeItem('dark-primary-color');
    localStorage.removeItem('transparent-primary-color');
    localStorage.removeItem('transparent-bg-color');
    switcher.removeForTransparent();
    switcher.updateChanges();
  }

  bgImage(e: any) {
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;

    let img = e.parentElement.classList[0];
    localStorage.setItem('BgImage', img);
    // this.body?.classList.add(img);
    let allImg = document.querySelectorAll('.bg-img');
    allImg.forEach((el, i) => {
      let ele = el.classList[0];
      this.body?.classList.remove(ele);
      this.body?.classList.add(img);
    });

    // Adding
    this.body?.classList.add('transparent-theme');
    localStorage.setItem('TransparentTheme', 'true');
    
    // Removing
    localStorage.removeItem('DarkTheme');
    localStorage.removeItem('LightTheme');
    this.body?.classList.remove('light-theme');
    this.body?.classList.remove('dark-theme'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');
    localStorage.removeItem('light-primary-color');
    localStorage.removeItem('light-primary-hover');
    localStorage.removeItem('light-primary-border');
    localStorage.removeItem('dark-primary-color');
    localStorage.removeItem('transparent-primary-color');
    localStorage.removeItem('transparent-bg-color');
    switcher.removeForTransparent();
    switcher.updateChanges();
  }
}
