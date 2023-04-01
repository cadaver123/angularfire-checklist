import { FirestoreService } from './firestore.service';
import { AngularFirestoreStub } from '../../../stubs/angular-firestore.stub';
import { FirestorePathHelperServiceStub } from '../firestore-path-helper/firestore-path-helper.service.stub';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestorePathHelperService } from '../firestore-path-helper/firestore-path-helper.service';
import { Point } from '@angular/cdk/drag-drop';
import { fakeAsync } from '@angular/core/testing';
import { AngularFirestoreCollectionStub } from 'src/app/stubs/angular-firestore-collection.stub';
import { WriteBatchStub } from '../../../stubs/write-batch.stub';
import { AngularFirestoreDocumentStub } from '../../../stubs/angular-firestore-document.stub';
import { FirestoreStub } from 'src/app/stubs/firestore.stub';
import firebase from 'firebase/compat';
import { DocumentReference } from '@angular/fire/compat/firestore/interfaces';
import { ColectionReferenceStub } from '../../../stubs/collection-reference.stub';
import { DocumentReferenceStub } from 'src/app/stubs/document-reference.stub';
import Firestore = firebase.firestore.Firestore;

describe('FirestoreService', () => {
  let service: FirestoreService;
  let dependencies: {
    db: AngularFirestoreStub;
    pathHelper: FirestorePathHelperServiceStub;
  };
  let collection: AngularFirestoreCollectionStub;
  let batch: WriteBatchStub;
  let document: AngularFirestoreDocumentStub;
  let tasks: {
    docs: Array<{
      ref: {
        id: string;
      }
    }>
  };
  let firestore: FirestoreStub;
  let documentReference: DocumentReferenceStub;

  beforeEach(() => {
    dependencies = {
      db: new AngularFirestoreStub(),
      pathHelper: new FirestorePathHelperServiceStub()
    };
    collection = new AngularFirestoreCollectionStub();
    collection.add.and.returnValue(Promise.resolve(null));
    documentReference = new DocumentReferenceStub();
    document = new AngularFirestoreDocumentStub();
    document.ref = documentReference as Partial<DocumentReference> as DocumentReference;

    dependencies.pathHelper.getChecklistsCollection.and.returnValue(Promise.resolve('checklistCollectionPath'));
    dependencies.pathHelper.getTasksCollection.and.returnValue(Promise.resolve('tasksCollectionPath'));
    dependencies.db.collection.and.returnValue(collection);
    dependencies.db.doc.and.returnValue(document);
    dependencies.pathHelper.getChecklistDocument.and.callFake((id: string) => {
      return Promise.resolve(`checklistDoc-${ id }`);
    });
    dependencies.pathHelper.getTasksDocument.and.callFake((id: string) => {
      return Promise.resolve(`taskDoc-${ id }`);
    });

    service = new FirestoreService(
      dependencies.db as Partial<AngularFirestore> as AngularFirestore,
      dependencies.pathHelper as Partial<FirestorePathHelperService> as FirestorePathHelperService);
  });

  describe('when creating a checklist', () => {
    beforeEach(fakeAsync(() => {
      service.createChecklist({ x: 1, y: 2 } as Point);
    }));

    it('should create a checklist', () => {
      expect(dependencies.db.collection).toHaveBeenCalledWith('checklistCollectionPath');
      expect(collection.add).toHaveBeenCalledWith({ name: '', x: 1, y: 2, created: jasmine.any(Date) });
    });
  });

  describe('when removing a checklist', () => {
    beforeEach(fakeAsync(() => {
      batch = new WriteBatchStub();
      firestore = new FirestoreStub();
      firestore.batch.and.returnValue(batch);
      tasks = {
        docs: [
          {
            ref: {
              id: 'task1'
            }
          },
          {
            ref: {
              id: 'task2'
            }
          }
        ]
      };
      collection.doc.and.returnValue(document);
      collection.get.and.returnValue({
        toPromise: () => {
          return Promise.resolve(tasks);
        }
      });
      dependencies.db.firestore = firestore as Partial<Firestore> as Firestore;

      service.removeChecklist('checklistId');
    }));

    it('should get reference to checklist', () => {
      expect(dependencies.db.collection).toHaveBeenCalledWith('checklistCollectionPath');
      expect(collection.doc).toHaveBeenCalledWith('checklistId');
    });

    it('should get reference to tasks attached to checklist', () => {
      expect(dependencies.db.collection).toHaveBeenCalledWith('tasksCollectionPath', jasmine.any(Function));
    });

    it('should use batch to remove tasks', () => {
      expect(batch.delete).toHaveBeenCalledWith(documentReference);
      expect(batch.delete).toHaveBeenCalledWith({ id: 'task1' });
      expect(batch.delete).toHaveBeenCalledWith({ id: 'task2' });
    });

    it('should commit the batch', () => {
      expect(batch.commit).toHaveBeenCalled();
    });

    describe('when querying for the tasks', () => {
      let collectionRef: ColectionReferenceStub;

      beforeEach(() => {
        collectionRef = new ColectionReferenceStub();

        dependencies.db.collection.calls.argsFor(1)[1](collectionRef);
      });

      it('should query for tasks assosiated with the collection', () => {
        expect(collectionRef.where).toHaveBeenCalledWith('checklistRef', '==', documentReference);
      });

      afterAll(() => {
        collectionRef = null;
      });
    });
  });

  describe('when updating a checklist name', () => {
    beforeEach(fakeAsync(() => {
      service.updateChecklistName('checklistId', 'new name');
    }));

    it('should select checklist', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('checklistDoc-checklistId');
    });

    it('should update checklist name', () => {
      expect(document.update).toHaveBeenCalledWith({ name: 'new name' });
    });
  });

  describe('when creating a task', () => {
    beforeEach(fakeAsync(() => {
      service.createTask('checklistId');
    }));

    it('should get the tasks collection', () => {
      expect(dependencies.db.collection).toHaveBeenCalledWith('tasksCollectionPath');
    });

    it('should get the checklist', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('checklistDoc-checklistId');
    });

    it('should add task', () => {
      expect(collection.add).toHaveBeenCalledWith({
        checklistRef: documentReference,
        created: jasmine.any(Date)
      });
    });
  });

  describe('when removing a task', () => {
    beforeEach(fakeAsync(() => {
      service.removeTask('taskId');
    }));

    it('should get the task', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('taskDoc-taskId');
    });

    it('should remove the task', () => {
      expect(document.ref.delete).toHaveBeenCalled();
    });
  });

  describe('when updating a checklist position', () => {
    beforeEach(fakeAsync(() => {
      service.updateChecklistPosition('checklistId', { x: 2, y: 3 });
    }));

    it('should select checklist', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('checklistDoc-checklistId');
    });

    it('should update checklist position', () => {
      expect(document.update).toHaveBeenCalledWith({ x: 2, y: 3 });
    });
  });

  describe('when updating a checklist color', () => {
    beforeEach(fakeAsync(() => {
      service.updateChecklistColor('checklistId', 2);
    }));

    it('should select checklist', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('checklistDoc-checklistId');
    });

    it('should update checklist color', () => {
      expect(document.update).toHaveBeenCalledWith({ color: 2 });
    });
  });

  describe('when updating a checklist size', () => {
    beforeEach(fakeAsync(() => {
      service.updateChecklistSize('checklistId', 10, 15);
    }));

    it('should select checklist', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('checklistDoc-checklistId');
    });

    it('should update checklist size', () => {
      expect(document.update).toHaveBeenCalledWith({ width: 10, height: 15 });
    });
  });

  describe('when updating a task message', () => {
    beforeEach(fakeAsync(() => {
      service.updateTaskMessage('taskId', 'a message');
    }));

    it('should select task', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('taskDoc-taskId');
    });

    it('should update task message', () => {
      expect(document.update).toHaveBeenCalledWith({ message: 'a message' });
    });
  });

  describe('when updating a task status', () => {
    beforeEach(fakeAsync(() => {
      service.updateTaskStatus('taskId', true);
    }));

    it('should select task', () => {
      expect(dependencies.db.doc).toHaveBeenCalledWith('taskDoc-taskId');
    });

    it('should update task status', () => {
      expect(document.update).toHaveBeenCalledWith({ checked: true });
    });
  });

  afterAll(() => {
    service = null;
    dependencies = null;
    collection = null;
    batch = null;
    document = null;
    tasks = null;
    firestore = null;
    documentReference = null;
  });
});
