import { Component, OnInit } from "@angular/core";
import { DevLinksService } from "../../service/links/dev-links/dev-links.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DevLinksModalComponent } from "../../modals/dev-links-modal/dev-links-modal.component";
import { DeleteLinksModalComponent } from "../../modals/delete-links-modal/delete-links-modal.component";

@Component({
  selector: "app-links",
  templateUrl: "./links.component.html",
  styleUrls: ["./links.component.css"]
})
export class LinksComponent implements OnInit {
  applications;
  links;

  selectedApplication;
  selectedEnv = "Dev";
  dataLoaded = false;

  alertVisible = false;
  alertText = "";

  constructor(
    private devLinksService: DevLinksService,
    private ngModel: NgbModal
  ) {}

  ngOnInit() {
    this.getLinks();
  }

  getLinks() {
    this.devLinksService.getAll().subscribe(response => {
      this.links = response;
      this.devLinksService.getApplications(apps => {
        this.applications = apps;
        this.selectApplication(this.applications[0]);
        this.dataLoaded = true;
        console.log(this.selectedApplication);
      });
    });
  }

  selectApplication(application) {
    this.selectedApplication = application;
  }

  isApplicationSelected(application): boolean {
    if (application._id === this.selectedApplication._id) {
      return true;
    } else {
      return false;
    }
  }

  selectEnv(env) {
    this.selectedEnv = env;
  }

  isEnvSelected(env): boolean {
    if (env === this.selectedEnv) {
      return true;
    } else {
      return false;
    }
  }

  addLink() {
    const modalRef = this.ngModel.open(DevLinksModalComponent);
    modalRef.componentInstance.setContent(
      this.selectedEnv,
      this.selectedApplication.name
    );
    modalRef.result
      .then(result => {
        this.showAlert(true, result.alertText);
        this.getLinks();
      })
      .catch(err => {
        console.log("modal dissmisssed");
      });
  }

  deleteLink() {
    const modalRef = this.ngModel.open(DeleteLinksModalComponent);
    modalRef.componentInstance.setContent(
      "Delete selected link",
      this.links,
      this.selectedEnv,
      this.selectedApplication.name
    );
    modalRef.result
      .then(result => {
        this.showAlert(result, "Link Deleted");
        this.getLinks();
      })
      .catch(err => {
        console.log("modal dissmisssed");
      });
  }

  showAlert(value: boolean, text: string) {
    this.alertVisible = value;
    this.alertText = text;
  }

  openExternalLink(link) {
    let url = "";

    if (!/^http[s]?:\/\//.test(link)) {
      url += "http://";
    }

    url += link;
    window.open(url, "_blank");
  }
}
