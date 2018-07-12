const signInController = require('../src/entities/signIn/controller')

describe('signInController', () => {
    let controller;

    describe('signIn', () => {
        it('should return status 400, 1001 and message if username is missing', () => {
            const mockReq = {
                body: {
                    Password: 'hello'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);

            controller = signInController(null);
            controller.signIn(mockReq, mockRes, null);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1001,
                message: 'Email/Username cannot be empty'
            });
        });

        it('should return status 400, 1004 and message if password is missing', () => {
            const mockReq = {
                body: {
                    Username: 'cbcortez3@up.edu.ph'
                }
            };
            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
    
            controller = signInController(null);
            controller.signIn(mockReq, mockRes, null);
    
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: 1004,
                message: 'Password cannot be empty'
            });
        });

        it('should return status 400, 1015 and message if invalid email or password', (done) => {
            const mockReq = {
                body: {
                    Username: 'cbcortez3@up.edu.ph',
                    Password: 'hello'
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['signIn']);
            
            mockRepo.signIn.and.callFake(() => {
                return Promise.reject(400)
            });
            controller = signInController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRes.status).toHaveBeenCalledWith(400);
                expect(param).toEqual({
                    status: 1015,
                    message: "Invalid email or password"
                });
                done()
            });

            controller.signIn(mockReq, mockRes, null);
        });
    });

    it('should return status 500 and message if internal server error at signing in', (done) => {
        const mockReq = {
            body: {
                Username: 'cbcortez3@up.edu.ph',
                Password: 'hello'
            }
        };

        const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
        const mockRepo = jasmine.createSpyObj('mockRepo', ['signIn']);
        
        mockRepo.signIn.and.callFake(() => {
            return Promise.reject(500)
        });
        controller = signInController(mockRepo);

        mockRes.json.and.callFake((param) => {
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(param).toEqual({
                status: 500,
                message: 'Internal server error'
            });
            done()
        });
        
        controller.signIn(mockReq, mockRes, null);
    });

    it('should return status 200 and message if successful sign in', (done) => {
        const mockReq = {
            body: {
                Username: 'cbcortez3@up.edu.ph',
                Password: 'hello'
            },
            session : {

            }
        };

        const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
        const mockRepo = jasmine.createSpyObj('mockRepo', ['signIn']);
        
        mockRepo.signIn.and.callFake(() => {
            return Promise.resolve(
                [[{
                    Username: 'cbcortez3@up.edu.ph',
                    Password: 'hello'
                }]]
            )
        });
        controller = signInController(mockRepo);

        mockRes.json.and.callFake((param) => {
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(param).toEqual({
                status: 200,
                message: 'Successfully signed in user!',
                data: {
                    Username: 'cbcortez3@up.edu.ph',
                    Password: 'hello'
                }
            });
            done()
        });
        controller.signIn(mockReq, mockRes, null);
    });

    describe('signOut', () => {
        it('should return status 200 and message if successful sign out', (done) => {
            const mockReq = {
                session: {
                    Username: 'yeay',
                    destroy: () =>{

                    }
                }
            };

            const mockRes = jasmine.createSpyObj('mockRes', ['status', 'json']);
            const mockRepo = jasmine.createSpyObj('mockRepo', ['signOut']);
            
            mockRepo.signOut.and.callFake(() => {
                return Promise.resolve(200)
            });
            controller = signInController(mockRepo);

            mockRes.json.and.callFake((param) => {
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(param).toEqual({
                    status: 200,
                    message: 'Successfully signs out!'
                });
                done()
            });
            controller.signOut(mockReq, mockRes, null);
        });
    });
});