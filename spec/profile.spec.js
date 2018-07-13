const profileController = require('../src/entities/profile/controller')

describe('profileController', () => {
    let controller;

    describe('editUser', () => {
        it('should return status 400, 1005 and message if no signed in user', () => {
            const mockReq = {
                session:{
                    
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    NewPassword: 'hitler19',
                    OldPassword: 'hitler19'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'UserId cannot be empty, you are not signed in'
            });
        });

        it('should return status 400, 1002 and message if First Name is missing', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    LastName: 'Cortez',
                    NewPassword: 'hitler19',
                    OldPassword: 'hitler19'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1002,
                message: 'First Name cannot be empty'
            });
        });

        it('should return status 400, 1003 and message if Last Name is missing', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Cortez',
                    NewPassword: 'hitler19',
                    OldPassword: 'hitler19'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1003,
                message: 'Last Name cannot be empty'
            });
        });

        it('should return status 400, 1006 and message if Old Password is missing', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Cortez',
                    LastName: 'Cortez',
                    NewPassword: 'hitler19'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1006,
                message: 'Old Password cannot be empty'
            });
        });

        it('should return status 400, 1004 and message if Password (New) is missing', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Cortez',
                    LastName: 'Cortez',
                    OldPassword: 'hitler19'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1004,
                message: 'Password cannot be empty'
            });
        });

        it('should return status 400, 1011 and message if invalid password length', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    OldPassword: 'hitler19',
                    NewPassword: 'hi'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1011,
                message: 'Invalid password, password must be 4 - 16 characters long'
            });
        });

        it('should return status 400, 1011 and message if invalid password length', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    OldPassword: 'hitler19',
                    NewPassword: '112345678901234567'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1011,
                message: 'Invalid password, password must be 4 - 16 characters long'
            });
        });

        it('should return status 400, 1012 and message password must be alphanumeric characters only', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId : 1
                    }
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    OldPassword: 'hitler19',
                    NewPassword: '123456+'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.editUser(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1012,
                message: 'Invalid password, must only contain alphanumeric characters'
            });
        });

        it('should return status 400, 1016 and message if invalid password', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    OldPassword: 'hitler',
                    NewPassword: '123456'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkPassword']);
            
            mockRepo.checkPassword.and.callFake(() => {
                return Promise.reject(400)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkPassword).toHaveBeenCalledWith(mockReq.body.OldPassword, mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1016,
                    message: "Invalid password"
                });
                done();
            });

            controller.editUser(mockReq, mockRes, null);
        });

        it('should return status 500 and message internal server error (checking password)', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                },
                body: {
                    FirstName: 'Sydney',
                    LastName: 'Cortez',
                    OldPassword: 'hitler',
                    NewPassword: '123456'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkPassword']);
            
            mockRepo.checkPassword.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkPassword).toHaveBeenCalledWith(mockReq.body.OldPassword, mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.editUser(mockReq, mockRes, null);
        });

        it('should return status 500 and message if successful check password but internal server error at edit User', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                },
                body: {
                    FirstName: 'mark',
                    LastName: 'cortez',
                    NewPassword: 'aldecimo',
                    OldPassword: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkPassword', 'editUser']);
            mockRepo.checkPassword.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.editUser.and.callFake(() => {
                return Promise.reject(500)
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkPassword).toHaveBeenCalledWith(mockReq.body.OldPassword, mockReq.session.secret.UserId);
                expect(mockRepo.editUser).toHaveBeenCalledWith(mockReq.session.secret.UserId, mockReq.body.FirstName, mockReq.body.LastName, mockReq.body.NewPassword);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: "Internal server error"
                });
                done()
            });
            controller.editUser(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful edit user', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                },
                body: {
                    FirstName: 'mark',
                    LastName: 'cortez',
                    NewPassword: 'aldecimo',
                    OldPassword: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkPassword', 'editUser']);
            mockRepo.checkPassword.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.editUser.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkPassword).toHaveBeenCalledWith(mockReq.body.OldPassword, mockReq.session.secret.UserId);
                expect(mockRepo.editUser).toHaveBeenCalledWith(mockReq.session.secret.UserId, mockReq.body.FirstName, mockReq.body.LastName, mockReq.body.NewPassword);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully edited user!'
                });
                done()
            });
            controller.editUser(mockReq, mockRes, null);
        });
    });


    describe('sendRequest', () => {
        it('should return status 400, 1005 and message if no signed in user', () => {
            const mockReq = {
                session:{
                    
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.sendRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 400, 1036 and message if user is already an admin', () => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.sendRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1036,
                message: 'Already an admin!'
            });
        });

        it('should return status 400, 1022 and message existing request', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequest']);
            
            mockRepo.checkExistingRequest.and.callFake(() => {
                return Promise.reject(400)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1022,
                    message: "Request is existing!"
                });
                done();
            });

            controller.sendRequest(mockReq, mockRes, null);
        });

        it('should return status 500 and message internal server error (check if existing requests)', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequest']);
            
            mockRepo.checkExistingRequest.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.sendRequest(mockReq, mockRes, null);
        });

        it('should return status 500 and message if request does not exist but internal server erro (sending request)', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequest', 'sendRequest']);
            mockRepo.checkExistingRequest.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.sendRequest.and.callFake(() => {
                return Promise.reject(500);
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRepo.sendRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: "Internal server error"
                });
                done()
            });
            controller.sendRequest(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful send request', (done) => {
            const mockReq = {
                session: {
                    secret: {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequest', 'sendRequest']);
            mockRepo.checkExistingRequest.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.sendRequest.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRepo.sendRequest).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully send a request!'
                });
                done()
            });
            controller.sendRequest(mockReq, mockRes, null);
        });
    });

    describe('approveRequest', () => {
        it('should return status 400, 1005 and message if no signed in user', () => {
            const mockReq = {
                session:{
                    
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.approveRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 400, 1034 and message if user is not an admin', () => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'MEMBER'
                    }
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.approveRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1034,
                message: 'You are not an admin!'
            });
        });

        it('should return status 400, 1023 and message request is not found', () => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{

                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.approveRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1023,
                message: 'Request cannot be empty!'
            });
        });

        it('should return status 500 and message internal server error (check existing request)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo']);
            
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.approveRequest(mockReq, mockRes, null);
        }); 

        it('should return status 500 and message existing request but internal server error at approving request', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo', 'approveRequest']);
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.approveRequest.and.callFake(() => {
                return Promise.reject(500);
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRepo.approveRequest).toHaveBeenCalledWith(mockReq.params.UserId)
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: "Internal server error"
                });
                done()
            });
            controller.approveRequest(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful approved request', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo', 'approveRequest']);
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.approveRequest.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRepo.approveRequest).toHaveBeenCalledWith(mockReq.params.UserId)
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully approved request!'
                });
                done()
            });
            controller.approveRequest(mockReq, mockRes, null);
        });
    });

    describe('rejectRequest', () => {
        it('should return status 400, 1005 and message if no signed in user', () => {
            const mockReq = {
                session:{
                    
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.rejectRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 400, 1034 and message if user is not an admin', () => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'MEMBER'
                    }
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.rejectRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1034,
                message: 'You are not an admin!'
            });
        });

        it('should return status 400, 1023 and message request is not found', () => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{

                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.rejectRequest(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1023,
                message: 'Request not found!'
            });
        });

        it('should return status 500 and message internal server error (check existing request)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo']);
            
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.rejectRequest(mockReq, mockRes, null);
        }); 

        it('should return status 500 and message existing request but internal server error (deleting request)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo', 'rejectRequest']);
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.rejectRequest.and.callFake(() => {
                return Promise.reject(500);
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRepo.rejectRequest).toHaveBeenCalledWith(mockReq.params.UserId)
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: "Internal server error"
                });
                done()
            });
            controller.rejectRequest(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful deleted request', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserType: 'ADMIN'
                    }
                },
                params:{
                    UserId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingRequestTwo', 'rejectRequest']);
            mockRepo.checkExistingRequestTwo.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.rejectRequest.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingRequestTwo).toHaveBeenCalledWith(mockReq.params.UserId);
                expect(mockRepo.rejectRequest).toHaveBeenCalledWith(mockReq.params.UserId)
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully deleted request!'
                });
                done()
            });
            controller.rejectRequest(mockReq, mockRes, null);
        });
    });

    describe('addFavorite', () => {
        it('should return status 400, 1005 and message no signed in user', () => {
            const mockReq = {
                session:{
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.addFavorite(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 400, 1039 and message empty MovieId', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId: 1
                    }
                },
                body: {
                }
            }
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.addFavorite(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1039,
                message: 'MovieId cannot be empty!'
            });
        });

        it('should return status 400, 1037 and message movie not found', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                },
                body:{
                    MovieId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingMovieId']);
            
            mockRepo.checkExistingMovieId.and.callFake(() => {
                return Promise.reject(400)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingMovieId).toHaveBeenCalledWith(mockReq.body.MovieId);
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1037,
                    message: "MovieId not found!"
                });
                done();
            });

            controller.addFavorite(mockReq, mockRes);
        }); 

        it('should return status 500 and message internal server error (check existing movie)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                },
                body:{
                    MovieId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingMovieId']);
            
            mockRepo.checkExistingMovieId.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingMovieId).toHaveBeenCalledWith(mockReq.body.MovieId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.addFavorite(mockReq, mockRes);
        }); 

        it('should return status 500 and message existing movie but internal server error (adding favorite)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 2
                    }
                },
                body:{
                    MovieId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingMovieId', 'addFavorite']);

            mockRepo.checkExistingMovieId.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.addFavorite.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingMovieId).toHaveBeenCalledWith(mockReq.body.MovieId);
                expect(mockRepo.addFavorite).toHaveBeenCalledWith(mockReq.body.MovieId, mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully added favorite!'
                });
                done()
            });
            controller.addFavorite(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful add favorite', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 2
                    }
                },
                body:{
                    MovieId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingMovieId', 'addFavorite']);

            mockRepo.checkExistingMovieId.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.addFavorite.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingMovieId).toHaveBeenCalledWith(mockReq.body.MovieId);
                expect(mockRepo.addFavorite).toHaveBeenCalledWith(mockReq.body.MovieId, mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully added favorite!'
                });
                done()
            });
            controller.addFavorite(mockReq, mockRes, null);
        });
    });

    describe('deleteFavorite', () => {
        it('should return status 400, 1005 and message no signed in user', () => {
            const mockReq = {
                session:{
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.deleteFavorite(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 400, 1039 and message empty favorite id', () => {
            const mockReq = {
                session:{
                    secret: {
                        UserId: 1
                    }
                },
                params: {
                }
            }
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.deleteFavorite(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1039,
                message: 'Favorite cannot be empty!'
            });
        });

        it('should return status 400, 1037 and message favorite not found', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                },
                params:{
                    FavoriteId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingFavoriteId']);
            
            mockRepo.checkExistingFavoriteId.and.callFake(() => {
                return Promise.reject(400)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingFavoriteId).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1037,
                    message: "FavoriteId not found!"
                });
                done();
            });

            controller.deleteFavorite(mockReq, mockRes);
        }); 

        it('should return status 500 and message internal server error (check existing favorite)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                },
                params:{
                    FavoriteId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingFavoriteId']);
            
            mockRepo.checkExistingFavoriteId.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRepo.checkExistingFavoriteId).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done();
            });

            controller.deleteFavorite(mockReq, mockRes);
        }); 

        it('should return status 500 and message existing favorite but internal server error (deleting favorite)', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 2
                    }
                },
                params:{
                    FavoriteId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingFavoriteId', 'deleteFavorite']);

            mockRepo.checkExistingFavoriteId.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.deleteFavorite.and.callFake(() => {
                return Promise.reject(500);
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingFavoriteId).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRepo.deleteFavorite).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Internal server error'
                });
                done()
            });
            controller.deleteFavorite(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful delete favorite', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 2
                    }
                },
                params:{
                    FavoriteId: 1
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkExistingFavoriteId', 'deleteFavorite']);

            mockRepo.checkExistingFavoriteId.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.deleteFavorite.and.callFake(() => {
                return Promise.resolve();
            });

            controller = profileController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRepo.checkExistingFavoriteId).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRepo.deleteFavorite).toHaveBeenCalledWith(mockReq.params.FavoriteId);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully deleted favorite!'
                });
                done()
            });
            controller.deleteFavorite(mockReq, mockRes, null);
        });     
    });

    describe('viewFavorite', () => {
        it('should return status 400, 1005 and message no signed in user', () => {
            const mockReq = {
                session:{
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.viewFavorite(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 500 and message internal server error', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['viewFavorite']);

            mockRepo.viewFavorite.and.callFake(() => {
                return Promise.reject(500)
            });
            controller = profileController(mockRepo);
    
            mockRes.json.and.callFake((param) => {
                expect(mockRepo.viewFavorite).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: 'Internal server error'
                });
                done()
            });
            controller.viewFavorite(mockReq, mockRes, null);
        }); 

        it('should return status 200 and message successfully viewed favorite', (done) => {
            const mockReq = {
                session:{
                    secret : {
                        UserId: 1
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['viewFavorite']);
  
            mockRepo.viewFavorite.and.callFake(() => {
                return Promise.resolve(
                    {}
                )
            });
            controller = profileController(mockRepo);
    
            mockRes.json.and.callFake((param) => {
                expect(mockRepo.viewFavorite).toHaveBeenCalledWith(mockReq.session.secret.UserId);
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(param).toEqual({
                    status: 200,
                    message: 'Successfully viewed favorite!',
                    data: {}
                });
                done()
            });
            controller.viewFavorite(mockReq, mockRes, null);
        }); 
    });

    describe('getSession', () => {
        it('should return status 400, 1005 and message no signed in user', () => {
            const mockReq = {
                session:{
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = profileController(null);
            controller.getSession(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1005,
                message: 'You are not signed in'
            });
        });

        it('should return status 200 and message successfully get session', () => {
            const mockReq = {
                session:{
                    secret : {
                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['viewFavorite']);
  
            mockRepo.viewFavorite.and.callFake(() => {
                return Promise.resolve(
                    {}
                )
            });
            controller = profileController(mockRepo);
    
            mockRes.json.and.callFake((param) => {
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(param).toEqual({
                    status: 200,
                    message: 'Successfully viewed favorite!',
                    data: {}
                });
            });
            controller.viewFavorite(mockReq, mockRes, null);
        });
    });
});