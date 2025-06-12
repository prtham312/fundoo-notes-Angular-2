import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(private http: HttpService) {}

  addNote(payload: any) {
    const headers = this.http.getHeader();
    return this.http.postApi('notes/addNotes', payload, headers);
  }

  getAllNotes() {
    const headers = this.http.getHeader();
    return this.http.getApi('notes/getNotesList', headers);
  }

archiveNote(payload: any) {
    const headers = this.http.getHeader();
    return this.http.postApi('notes/archiveNotes', payload, headers);
  }

pinNote(payload: any) {
  const headers = this.http.getHeader();
  return this.http.postApi('notes/pinUnpinNotes', payload, headers);
}

 trashNote(payload: { noteIdList: string[]; isDeleted: boolean }) {
    const headers = this.http.getHeader();
    return this.http.postApi('notes/trashNotes', payload, headers);
  }

  getTrashedNotes() {
    const headers = this.http.getHeader();
    return this.http.getApi('notes/getTrashNotesList', headers);
  }

  changeNoteColor(payload: { color: string; noteIdList: string[] }) {
    const headers = this.http.getHeader();
    return this.http.postApi('notes/changesColorNotes', payload, headers);
  }

  deleteForever(payload: { noteIdList: string[] }) {
    const headers = this.http.getHeader();
    return this.http.postApi('notes/deleteForeverNotes', payload, headers);
  }

  


  

}
