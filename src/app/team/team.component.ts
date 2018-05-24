import { Component, OnInit, Injectable, Input } from '@angular/core';
import { TeammemberService } from '../service/teammember/teammember.service';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamMemberComponent } from '../modals/team-member-modal/team-member.component';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent implements OnInit {

  alertVisible = false;
  alertText = "";
  employees;
  selectedEmployee;
  isDataLoaded = false;

  constructor(private service: TeammemberService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getTeamMembers();
  }

  selectEmployee(employee) {
    this.selectedEmployee = employee;
  }

  isSelected(employee): boolean {
    if (employee._id == this.selectedEmployee._id)
      return true;
    else
      return false;
  }

  addTeamMember() {
    const modalRef = this.modalService.open(TeamMemberComponent);
    modalRef.componentInstance.setContent("Add team member", "Add");
    modalRef.result.then(result => {
      this.showAlert(true, result.alertText);
      this.getTeamMembers();
    }).catch(err => {
      console.log("modal dissmisssed");
    })
  }

  updateTeamMember() {
    const modalRef = this.modalService.open(TeamMemberComponent);
    modalRef.componentInstance.setContent("Update team member", "Update");
    modalRef.componentInstance.populateFields(this.selectedEmployee);
    modalRef.result.then(result => {
      this.showAlert(true, result.alertText);
      this.getTeamMembers();
    }).catch(err => {
      console.log("modal dissmisssed");
    })
  }

  getTeamMembers() {
    this.service.getAll()
      .subscribe(response => {
        this.employees = response.json();
        this.selectedEmployee = this.employees[0];
        this.isDataLoaded = true;
      });
  }

  confirmDeleteTeamMember() {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.setContent("Delete", "Are you sure you want to delete this team member?");
    modalRef.result.then(result => {
      if (result)
        this.deleteTeamMember();
    }).catch(err => {
      console.log("modal dissmisssed");
    })
  }

  deleteTeamMember() {
    this.service.delete(this.selectedEmployee._id).subscribe(response => {
      this.showAlert(true, "Team member deleted successfully");
      this.getTeamMembers();
    })
  }

  showAlert(value: boolean, text: string) {
    this.alertVisible = value;
    this.alertText = text;
  }

}
