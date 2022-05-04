import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";

import { Nav } from "../Nav";

import { AuthContext } from "../../context/auth-context";

// Set up context for test
const value = {
  authData: {
    admin: {
      avatarUrl:
        "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=500",
      name: "Poo Suu Admin",
      username: "admin",
    },
  },
  setAuthData: jest.fn(),
};

describe("Nav should", () => {
  afterEach(() => {
    cleanup();
  });

  it("show heading text 'Poo Suu Admins' when user is not logged in.", () => {
    const MockedNav = () => {
      return (
        <Router>
          <AuthContext.Provider value={{}}>
            <Nav />
          </AuthContext.Provider>
        </Router>
      );
    };

    render(<MockedNav />);

    const navElement = screen.getByText(/poo suu admins/i);
    expect(navElement).toBeDefined();
  });

  it("show username and profile picture when user is logged in.", () => {
    const MockedNav = () => {
      return (
        <Router>
          <AuthContext.Provider value={value}>
            <Nav />
          </AuthContext.Provider>
        </Router>
      );
    };

    render(<MockedNav />);

    const adminText = screen.getByText(value.authData.admin.username);
    const adminImg = screen.getByRole("img");
    expect(adminText).toBeDefined();
    expect(adminImg).toBeDefined();
  });

  it("show menu items when user is logged in.", () => {
    const MockedNav = () => {
      return (
        <Router>
          <AuthContext.Provider value={value}>
            <Nav />
          </AuthContext.Provider>
        </Router>
      );
    };

    render(<MockedNav />);

    const myAccount = screen.getByText(/my account/i);
    const addLyrics = screen.getByText(/add lyrics/i);
    const addSong = screen.getByText(/add Song/i);
    const addArtist = screen.getByText(/add artist/i);

    expect(myAccount).toBeDefined();
    expect(addLyrics).toBeDefined();
    expect(addSong).toBeDefined();
    expect(addArtist).toBeDefined();
  });
});
