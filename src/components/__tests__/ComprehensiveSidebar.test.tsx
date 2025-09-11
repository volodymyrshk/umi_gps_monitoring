import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ComprehensiveSidebar from '../ComprehensiveSidebar'
import { Vehicle } from '@/lib/entities/vehicle'

// Mock vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Test Vehicle 1',
    displayName: 'TV1',
    type: 'truck',
    status: { status: 'online', lastUpdate: new Date() },
    currentLocation: {
      latitude: 50.4501,
      longitude: 30.5234,
      address: 'Test Address 1',
      timestamp: new Date()
    },
    fuel: {
      level: 75,
      capacity: 100,
      consumption: 15.5
    },
    speed: 45,
    course: 180,
    lastUpdate: new Date()
  },
  {
    id: '2',
    name: 'Test Vehicle 2',
    displayName: 'TV2',
    type: 'car',
    status: { status: 'warning', lastUpdate: new Date() },
    currentLocation: {
      latitude: 50.4501,
      longitude: 30.5234,
      address: 'Test Address 2',
      timestamp: new Date()
    },
    fuel: {
      level: 25,
      capacity: 60,
      consumption: 8.5
    },
    speed: 0,
    course: 0,
    lastUpdate: new Date()
  }
]

describe('ComprehensiveSidebar', () => {
  const defaultProps = {
    vehicles: mockVehicles,
    selectedVehicle: null,
    onVehicleSelect: jest.fn(),
    onFilterChange: jest.fn(),
    isOpen: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the sidebar with correct title', () => {
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    expect(screen.getByText('Объекты')).toBeInTheDocument()
  })

  it('displays both folder structures correctly', () => {
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    // Check for the first folder
    expect(screen.getByText('Тарировка Август 2024')).toBeInTheDocument()
    expect(screen.getByText(mockVehicles.length.toString())).toBeInTheDocument()
    
    // Check for the second folder
    expect(screen.getByText('Архивные данные')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('toggles first folder expansion correctly', async () => {
    const user = userEvent.setup()
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    const firstFolderButton = screen.getByText('Тарировка Август 2024').closest('button')
    expect(firstFolderButton).toBeInTheDocument()
    
    // Initially expanded, should show vehicles
    expect(screen.getByText('Test Vehicle 1')).toBeInTheDocument()
    
    // Click to collapse
    await user.click(firstFolderButton!)
    
    // Vehicles should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Test Vehicle 1')).not.toBeInTheDocument()
    })
    
    // Click to expand again
    await user.click(firstFolderButton!)
    
    // Vehicles should be visible again
    await waitFor(() => {
      expect(screen.getByText('Test Vehicle 1')).toBeInTheDocument()
    })
  })

  it('toggles second folder expansion correctly', async () => {
    const user = userEvent.setup()
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    const secondFolderButton = screen.getByText('Архивные данные').closest('button')
    expect(secondFolderButton).toBeInTheDocument()
    
    // Initially collapsed, archive items should not be visible
    expect(screen.queryByText('Тарировка Июль 2024')).not.toBeInTheDocument()
    
    // Click to expand
    await user.click(secondFolderButton!)
    
    // Archive items should be visible
    await waitFor(() => {
      expect(screen.getByText('Тарировка Июль 2024')).toBeInTheDocument()
      expect(screen.getByText('Тарировка Июнь 2024')).toBeInTheDocument()
    })
    
    // Click to collapse
    await user.click(secondFolderButton!)
    
    // Archive items should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Тарировка Июль 2024')).not.toBeInTheDocument()
    })
  })

  it('displays vehicles with proper indentation and hierarchy', () => {
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    // Check that vehicles are rendered within the folder structure
    const vehicleElements = screen.getAllByText(/Test Vehicle/)
    expect(vehicleElements).toHaveLength(2)
    
    // Check that vehicles are properly nested within the folder
    const firstVehicle = screen.getByText('Test Vehicle 1').closest('div')
    expect(firstVehicle).toHaveClass('pl-6') // Should have left padding for indentation
  })

  it('shows correct vehicle counts and status', () => {
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    // Check vehicle count in folder
    expect(screen.getByText(mockVehicles.length.toString())).toBeInTheDocument()
    
    // Check status counts in footer
    expect(screen.getByText(/Активных: 1/)).toBeInTheDocument()
    expect(screen.getByText(/Проблемы: 1/)).toBeInTheDocument()
  })

  it('calls onVehicleSelect when a vehicle is clicked', async () => {
    const user = userEvent.setup()
    const onVehicleSelect = jest.fn()
    
    render(<ComprehensiveSidebar {...defaultProps} onVehicleSelect={onVehicleSelect} />)
    
    const vehicleCard = screen.getByText('Test Vehicle 1').closest('div')
    expect(vehicleCard).toBeInTheDocument()
    
    await user.click(vehicleCard!)
    
    expect(onVehicleSelect).toHaveBeenCalledWith(mockVehicles[0])
  })

  it('toggles filters dropdown', async () => {
    const user = userEvent.setup()
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    const filtersButton = screen.getByText('Фильтры').closest('button')
    expect(filtersButton).toBeInTheDocument()
    
    // Initially closed
    expect(screen.queryByText('Все')).not.toBeInTheDocument()
    
    // Click to open
    await user.click(filtersButton!)
    
    // Filter buttons should be visible
    await waitFor(() => {
      expect(screen.getByText('Все')).toBeInTheDocument()
      expect(screen.getByText('Активные')).toBeInTheDocument()
      expect(screen.getByText('Проблемы')).toBeInTheDocument()
    })
  })

  it('applies filters correctly', async () => {
    const user = userEvent.setup()
    const onFilterChange = jest.fn()
    
    render(<ComprehensiveSidebar {...defaultProps} onFilterChange={onFilterChange} />)
    
    // Open filters
    const filtersButton = screen.getByText('Фильтры').closest('button')
    await user.click(filtersButton!)
    
    // Click on "Активные" filter
    const activeFilter = screen.getByText('Активные')
    await user.click(activeFilter)
    
    expect(onFilterChange).toHaveBeenCalledWith({ status: 'online' })
  })

  it('shows proper visual hierarchy with borders and colors', () => {
    render(<ComprehensiveSidebar {...defaultProps} />)
    
    // Check that the first folder has proper styling
    const firstFolderContainer = screen.getByText('Тарировка Август 2024').closest('div')?.parentElement
    expect(firstFolderContainer).toHaveClass('border-b', 'border-gray-100/50')
    
    // Check that the second folder exists
    const secondFolderContainer = screen.getByText('Архивные данные').closest('div')?.parentElement
    expect(secondFolderContainer).toHaveClass('border-b', 'border-gray-100/50')
  })

  it('handles empty vehicle list gracefully', () => {
    render(<ComprehensiveSidebar {...defaultProps} vehicles={[]} />)
    
    // Should still show the folder structure
    expect(screen.getByText('Тарировка Август 2024')).toBeInTheDocument()
    expect(screen.getByText('Архивные данные')).toBeInTheDocument()
    
    // Should show 0 count
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})