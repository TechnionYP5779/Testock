import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSlideToggleChange, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {DbService} from '../../core/db.service';
import {UserData} from '../../entities/user';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['name', 'faculty', 'email', 'admin'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private db: DbService, private spinner: NgxSpinnerService, private snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    this.db.getAllUsers().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = ((data, sortHeaderId) => {
        if (sortHeaderId === 'admin') { return data.roles.admin; }
        return data[sortHeaderId];
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  trackByUid(index, item) {
    return item.uid;
  }

  adminPermissionChanged(user: UserData, $event: MatSlideToggleChange) {
    this.spinner.show();
    const roles = {admin: $event.checked};
    this.db.setUserRoles(user.uid, roles).then(() => this.spinner.hide()).then(() => {
      this.snackBar.open(`Permissions for ${user.name} set successfully!`, 'close', {duration: 3000});
    });
  }
}
