import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const baslik = screen.getByText(/İletişim Formu/i);
  expect(baslik).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const isimT = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimT, "Sefa");
  const isimE = screen.findByTestId("error");
  expect(await isimE).toBeVisible();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const isimEr = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimEr, "Burak");

  const soyadEr = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyadEr, "Torun");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const isimEr = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimEr, "İlhan");

  const soyadEr = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyadEr, "mansız");

  const mailEr = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailEr, "yüzyılıngolcüsü@hotmail");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const isimEr = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimEr, "Burak");

  const mailEr = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailEr, "burak@hotmail.com");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);

  const isimEr = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(isimEr, "Burak");

  const soyadEr = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(soyadEr, "Torun");

  const mailEr = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(mailEr, "burak@hotmail.com");

  const sButton = screen.getByText(/Gönder/);
  userEvent.click(sButton);

  await waitFor(
    () => {
      const er = screen.queryAllByTestId("error");
      expect(er.length).toBe(0);
    },
    { timeout: 4000 }
  );
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Burak");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Torun");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "burak@hotmail.com"
  );
  userEvent.type(screen.getByText("Mesaj"), "homework done");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Burak"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Torun"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "burak@hotmail.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "homework done"
  );
});
