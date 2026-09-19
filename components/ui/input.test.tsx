import React from "react"
import { render, screen } from "@testing-library/react"
import { Input } from "./input"

describe("Input Component", () => {
  it("renders without crashing", () => {
    render(<Input />)
  })

  it("renders with label", () => {
    render(<Input label="Email" />)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renders with error message", () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText("This field is required")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("renders with helper text", () => {
    render(<Input helperText="Enter your email address" />)
    expect(screen.getByText("Enter your email address")).toBeInTheDocument()
  })

  it("renders with icon on left", () => {
    render(<Input icon={<span data-testid="icon">📧</span>} iconPosition="left" />)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("renders with icon on right", () => {
    render(<Input icon={<span data-testid="icon">✓</span>} iconPosition="right" />)
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("applies default variant styles", () => {
    const { container } = render(<Input variant="default" />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("border-input")
  })

  it("applies filled variant styles", () => {
    const { container } = render(<Input variant="filled" />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("border-transparent")
  })

  it("applies error styles when error is present", () => {
    const { container } = render(<Input error="Invalid input" />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("border-error")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("applies disabled state", () => {
    const { container } = render(<Input disabled />)
    const input = container.querySelector("input")
    expect(input).toBeDisabled()
    expect(input).toHaveClass("disabled:opacity-50")
  })

  it("has minimum 44px height for touch targets", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("min-h-touch")
  })

  it("renders with all props combined", () => {
    render(
      <Input
        label="Username"
        error="Username is required"
        icon={<span data-testid="icon">👤</span>}
        iconPosition="left"
        placeholder="Enter username"
      />
    )
    expect(screen.getByText("Username")).toBeInTheDocument()
    expect(screen.getByText("Username is required")).toBeInTheDocument()
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument()
  })

  it("shows helper text but not error when no error is present", () => {
    render(<Input helperText="Helper text" />)
    expect(screen.getByText("Helper text")).toBeInTheDocument()
  })

  it("shows error instead of helper text when error is present", () => {
    render(<Input error="Error text" helperText="Helper text" />)
    expect(screen.getByText("Error text")).toBeInTheDocument()
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument()
  })

  it("applies small size variant", () => {
    const { container } = render(<Input inputSize="sm" />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("min-h-[40px]")
  })

  it("applies large size variant", () => {
    const { container } = render(<Input inputSize="lg" />)
    const input = container.querySelector("input")
    expect(input).toHaveClass("min-h-[52px]")
  })

  it("generates unique id when not provided", () => {
    const { container: container1 } = render(<Input />)
    const { container: container2 } = render(<Input />)
    const input1 = container1.querySelector("input")
    const input2 = container2.querySelector("input")
    expect(input1?.id).not.toBe(input2?.id)
  })

  it("uses provided id", () => {
    const { container } = render(<Input id="custom-id" />)
    const input = container.querySelector("input")
    expect(input).toHaveAttribute("id", "custom-id")
  })

  it("associates label with input using htmlFor", () => {
    render(<Input id="test-input" label="Test Label" />)
    const label = screen.getByText("Test Label")
    expect(label).toHaveAttribute("for", "test-input")
  })

  it("associates error message with input using aria-describedby", () => {
    const { container } = render(<Input id="test-input" error="Error message" />)
    const input = container.querySelector("input")
    expect(input).toHaveAttribute("aria-describedby", "test-input-error")
  })

  it("associates helper text with input using aria-describedby", () => {
    const { container } = render(<Input id="test-input" helperText="Helper text" />)
    const input = container.querySelector("input")
    expect(input).toHaveAttribute("aria-describedby", "test-input-helper")
  })
})
