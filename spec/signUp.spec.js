const signUpController = require('../src/entities/signUp/controller')

describe('signUpController', () => {
    let controller;
    describe('addMember', () => {
        it('should return status 400, 1001 and message if username is missing', () => {
            // arrange
            const mockReq = {
                body: {
                    FirstName: 'mark',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);

            // act
            controller.addMember(mockReq, mockRes, null);

            // assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1001,
                message: 'Email cannot be empty'
            });
        });

        it('should return status 400, 1002 and message if First Name is missing', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1002,
                message: 'First Name cannot be empty'
            });
        });

        it('should return status 400, 1003 and message if Last Name is missing', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    FirstName: 'aldecimo',
                    Password: 'hello'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1003,
                message: 'Last Name cannot be empty'
            });
        });

        it('should return status 400, 1004 and message if Password is missing', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    FirstName: 'aldecimo',
                    LastName: 'mark'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1004,
                message: 'Password cannot be empty'
            });
        });

        it('should return status 400, 1011 and message if Password is not 4-16 characters long', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    FirstName: 'aldecimo',
                    LastName: 'mark',
                    Password: 'hi'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1011,
                message: 'Invalid password, password must be 4 - 16 characters long'
            });
        });        

        it('should return status 400, 1011 and message if Password is not 4-16 characters long', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    FirstName: 'aldecimo',
                    LastName: 'mark',
                    Password: '12345678901234567'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1011,
                message: 'Invalid password, password must be 4 - 16 characters long'
            });
        }); 

        it('should return status 400, 1013 and message if Username/Email is invalid', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@@@saperium.com',
                    FirstName: 'aldecimo',
                    LastName: 'mark',
                    Password: 'hiiiii'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1013,
                message: 'Invalid email'
            });
        }); 

        it('should return status 400, 1012 and message if Password does not contain alphanumeric characters only', () => {
            // arrange
            const mockReq = {
                body: {
                    Username: 'mark@saperium.com',
                    FirstName: 'aldecimo',
                    LastName: 'mark',
                    Password: 'hi++'
                }
            };
            
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signUpController(null);
            controller.addMember(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1012,
                message: 'Invalid password, must only contain alphanumeric characters'
            });
        }); 

        it('should return status 400 and message if existing email', (done) => {
            const mockReq = {
                body: {
                    Username: 'cbcortez3@up.edu.ph',
                    FirstName: 'mark',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkDuplicate', 'signUp']);
            
            mockRepo.checkDuplicate.and.callFake(() => {
                return Promise.reject(400)
            });

            controller = signUpController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1021,
                    message: "Email is existing"
                });
                done()
            });

            controller.addMember(mockReq, mockRes, null);
        });

        it('should return status 500 and message if internal server error at checking duplicate email', (done) => {
            const mockReq = {
                body: {
                    Username: 'cbcortez3@up.edu.ph',
                    FirstName: 'mark',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkDuplicate', 'signUp']);
            
            mockRepo.checkDuplicate.and.callFake(() => {
                return Promise.reject(500)
            });

            controller = signUpController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(param).toEqual({
                    status: 500,
                    message: "Internal server error"
                });
                done()
            });

            controller.addMember(mockReq, mockRes, null);
        });

        it('should return status 500 and message if not existing email but internal server error at signing up', (done) => {
            const mockReq = {
                body: {
                    Username: 'mark.aldecimo@saperium.com',
                    FirstName: 'mark',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };
    
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
    
            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkDuplicate', 'signUp']);
            mockRepo.checkDuplicate.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.signUp.and.callFake(() => {
                return Promise.reject(500);
            });
    
            controller = signUpController(mockRepo);
    
            mockRes.json.and.callFake(() => {
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 500,
                    message: 'Internal server error'
                });
                done()
            });
            controller.addMember(mockReq, mockRes, null);
        });

        it('should return status 200 and message if successful sign in', (done) => {
            const mockReq = {
                body: {
                    Username: 'mark.aldecimo@saperium.com',
                    FirstName: 'mark',
                    LastName: 'aldecimo',
                    Password: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            const mockRepo = jasmine.createSpyObj('mockRepo', ['checkDuplicate', 'signUp']);
            mockRepo.checkDuplicate.and.callFake(() => {
                return Promise.resolve();
            });
            mockRepo.signUp.and.callFake(() => {
                return Promise.resolve();
            });

            controller = signUpController(mockRepo);

            mockRes.json.and.callFake(() => {
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({
                    status: 200,
                    message: 'Successfully added user!'
                });
                done()
            });
            controller.addMember(mockReq, mockRes, null);
        });
    });
});


