import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DevLinksService } from '../../service/links/dev-links/dev-links.service';

@Component({
  selector: 'app-dev-links-modal',
  templateUrl: './dev-links-modal.component.html',
  styleUrls: ['./dev-links-modal.component.css']
})
export class DevLinksModalComponent implements OnInit {

  title = 'Add Link for the selected enviroment';
  devLink: any = {};
  constructor(public activeModal: NgbActiveModal, private devLinksService: DevLinksService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  setContent(env, app) {
    this.title = 'Add link for ' + app + ' - ' + env;
    this.devLink.application = app;
    this.devLink.env = env;
  }

  submit() {
    console.log('in submit');
      this.addLink();
  }

  addLink() {
    this.devLinksService.add(this.devLink).subscribe(res => {
      this.toastr.success('Link added successfully', 'Link');
      this.activeModal.close({ alertText: 'Link added' });
    });
  }

  populateFields(devLink) {
    this.devLink = devLink;
  }

}
